"use server";

import { prisma } from "./client";
import { Transaction, TRANSACTION_CATEGORY } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { initRedis } from "@/lib/ioredis/server";

/**
 * Creates a new transaction.
 * @param data - Transaction data excluding id, createdAt, and ownerId.
 * @returns The created transaction.
 * @throws Error if user is not authenticated or creation fails.
 */
export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt" | "ownerId">
): Promise<Transaction> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const rs = await prisma.transaction.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
    sumAmountByCategoryUpdateCache(data.cat);
    return rs;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Failed to create transaction");
  }
}

/**
 * Retrieves a transaction by its unique ID for the authenticated user.
 * @param uniqueId - The unique ID of the transaction.
 * @returns The transaction or null if not found or not owned by the user.
 * @throws Error if user is not authenticated.
 */
export async function getTransactionByUniqueId(
  uniqueId: string
): Promise<Transaction | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const rs = await prisma.transaction.findUnique({
      where: {
        uniqueId: uniqueId,
        ownerId: userId, // Ensure the user owns this transaction
      },
    });
    return rs;
  } catch (error) {
    console.error("Error getting transaction by uniqueId:", error);
    // Depending on strategy, you might want to throw or return null
    return null;
  }
}

/**
 * Retrieves all transactions for the authenticated user.
 * @returns An array of transactions.
 * @throws Error if user is not authenticated.
 */
export async function getAllTransactions(): Promise<Transaction[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.transaction.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc", // Optional: order by creation date
      },
    });
  } catch (error) {
    console.error("Error getting all transactions:", error);
    return []; // Return empty array on error
  }
}

/**
 * Finds transactions by category for the authenticated user.
 * @param category - The category to filter by.
 * @returns An array of transactions matching the category.
 * @throws Error if user is not authenticated.
 */
export async function findTransactionsByCategory(
  category: TRANSACTION_CATEGORY
): Promise<Transaction[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        cat: category,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error finding transactions by category:", error);
    return [];
  }
}

/**
 * Calculates the sum of transaction amounts (amount * sign) for a specific category
 * for the authenticated user.
 * @param category - The category to sum amounts for.
 * @returns The total sum for the category.
 * @throws Error if user is not authenticated.
 */
export async function sumAmountByCategory(
  category: TRANSACTION_CATEGORY
): Promise<number> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const redis = initRedis();
    const cache = await redis.hget(`${userId}:sum`, category);
    if (cache) return Number(cache);
    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        cat: category,
      },
      select: {
        amount: true,
        sign: true,
      },
    });
    // Calculate sum considering the sign
    const total = transactions.reduce(
      (sum: number, tx: { amount: number; sign: number }) =>
        sum + tx.amount * tx.sign,
      0
    );
    await redis.hset(`${userId}:sum`, { [category]: total });
    await redis.expire(`${userId}:sum`, 60 * 15);
    return total;
  } catch (error) {
    console.error("Error summing amount by category:", error);
    return 0; // Return 0 on error
  }
}

export async function sumAmountByCategoryUpdateCache(
  category: TRANSACTION_CATEGORY
): Promise<number> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    const redis = initRedis();
    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        cat: category,
      },
      select: {
        amount: true,
        sign: true,
      },
    });
    // Calculate sum considering the sign
    const total = transactions.reduce(
      (sum: number, tx: { amount: number; sign: number }) =>
        sum + tx.amount * tx.sign,
      0
    );
    await redis.hset(`${userId}:sum`, { [category]: total });
    await redis.expire(`${userId}:sum`, 60 * 15);
    return total;
  } catch (error) {
    console.error("Error summing amount by category:", error);
    return 0; // Return 0 on error
  }
}

/**
 * Calculates the sum of transaction amounts (amount * sign) for multiple categories
 * for the authenticated user.
 * @param categories - An array of categories to sum amounts for.
 * @returns The total sum for the specified categories.
 * @throws Error if user is not authenticated.
 */
export async function sumAmountByCategories(
  categories: TRANSACTION_CATEGORY[]
): Promise<number> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  if (!categories || categories.length === 0) {
    return 0; // No categories provided, sum is 0
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: userId,
        cat: {
          in: categories, // Filter by categories in the provided array
        },
      },
      select: {
        amount: true,
        sign: true,
      },
    });
    // Calculate sum considering the sign
    const total = transactions.reduce(
      (sum: number, tx: { amount: number; sign: number }) =>
        sum + tx.amount * tx.sign,
      0
    );
    return total;
  } catch (error) {
    console.error("Error summing amount by categories:", error);
    return 0; // Return 0 on error
  }
}

/**
 * Deletes a transaction by its unique ID for the authenticated user.
 * Note: Consider if transactions should be truly deleted or marked as inactive/reversed.
 * This implementation performs a hard delete.
 * @param uniqueId - The unique ID of the transaction to delete.
 * @returns The deleted transaction.
 * @throws Error if user is not authenticated or deletion fails.
 */
export async function deleteTransactionByUniqueId(
  uniqueId: string
): Promise<Transaction> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    // First, verify the transaction exists and belongs to the user
    const transaction = await prisma.transaction.findUnique({
      where: {
        uniqueId: uniqueId,
        ownerId: userId,
      },
    });

    if (!transaction) {
      throw new Error(
        "Transaction not found or user does not have permission to delete it."
      );
    }

    // Proceed with deletion
    const rs = await prisma.transaction.delete({
      where: {
        uniqueId: uniqueId,
        // Including ownerId again for safety, though uniqueId should suffice
        // ownerId: userId
      },
    });
    sumAmountByCategoryUpdateCache(transaction.cat);

    return rs;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    // Rethrow or handle specific Prisma errors (e.g., P2025 Record not found)
    if (error instanceof Error && error.message.includes("not found")) {
      throw new Error("Transaction not found or already deleted.");
    }
    throw new Error("Failed to delete transaction");
  }
}

// Note: Update functionality is not included as transactions are often immutable.
// If updates are needed (e.g., correcting a type/category), an update function
// similar to updateChatSession or updateProfile could be added, ensuring ownerId check.
// Example:
/*
export async function updateTransaction(
  uniqueId: string,
  data: Partial<Omit<Transaction, 'id' | 'ownerId' | 'createdAt' | 'uniqueId'>>
): Promise<Transaction> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    // Verify ownership before update
    const existingTransaction = await prisma.transaction.findUnique({
      where: { uniqueId: uniqueId, ownerId: userId },
    });
    if (!existingTransaction) {
      throw new Error("Transaction not found or permission denied.");
    }

    return await prisma.transaction.update({
      where: {
        uniqueId: uniqueId,
        // ownerId: userId // uniqueId is already unique, but ownerId check is done above
      },
      data,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw new Error("Failed to update transaction");
  }
}
*/
