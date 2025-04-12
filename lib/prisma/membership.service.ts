"use server";
import { prisma } from "./client";
import { Membership } from "@prisma/client"; // Assuming Membership type exists
import { auth } from "@clerk/nextjs/server";

/**
 * Creates a new membership record.
 * Assumes Membership model has an ownerId field linked to the user.
 * @param data - Membership data excluding id, createdAt, updatedAt, and ownerId.
 * @returns The created membership record.
 * @throws Error if user is not authenticated or creation fails.
 */
export async function createMembership(
  data: Omit<Membership, "id" | "createdAt" | "updatedAt" | "ownerId">
): Promise<Membership> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated. Cannot create membership.");
  }
  try {
    return await prisma.membership.create({
      data: {
        ...data,
        ownerId: userId, // Assuming ownerId links membership to the user
      },
    });
  } catch (error) {
    console.error("Error creating membership:", error);
    throw new Error("Failed to create membership.");
  }
}

/**
 * Retrieves a membership record by its ID for the authenticated user.
 * @param id - The ID of the membership record.
 * @returns The membership record or null if not found or not owned by the user.
 * @throws Error if user is not authenticated.
 */
export async function getMembershipById(id: string): Promise<Membership | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated. Cannot retrieve membership.");
  }
  try {
    return await prisma.membership.findUnique({
      where: {
        id: id,
        ownerId: userId, // Ensure the user owns this membership
      },
    });
  } catch (error) {
    console.error("Error getting membership by id:", error);
    return null; // Or throw, depending on error handling strategy
  }
}

/**
 * Retrieves all membership records for the authenticated user.
 * @returns An array of membership records.
 * @throws Error if user is not authenticated.
 */
export async function getAllMemberships(): Promise<Membership[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated. Cannot retrieve memberships.");
  }
  try {
    return await prisma.membership.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        id: "desc", // Order by ID if createdAt is not available
      },
    });
  } catch (error) {
    console.error("Error getting all memberships:", error);
    return []; // Return empty array on error
  }
}

/**
 * Updates a membership record by its ID for the authenticated user.
 * @param id - The ID of the membership record to update.
 * @param data - Partial data to update the membership record with.
 * @returns The updated membership record.
 * @throws Error if user is not authenticated, record not found, or update fails.
 */
export async function updateMembership(
  id: string,
  data: Partial<Omit<Membership, "id" | "ownerId" | "createdAt" | "updatedAt">>
): Promise<Membership> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated. Cannot update membership.");
  }
  try {
    // Optional: Verify ownership before update if needed, though `where` clause handles it.
    const existingMembership = await prisma.membership.findUnique({
        where: { id: id, ownerId: userId },
    });
    if (!existingMembership) {
        throw new Error("Membership not found or permission denied.");
    }

    return await prisma.membership.update({
      where: {
        id: id,
        ownerId: userId, // Ensure the user owns this membership
      },
      data,
    });
  } catch (error) {
    console.error("Error updating membership:", error);
     if (error instanceof Error && error.message.includes("permission denied")) {
        throw error;
     }
    throw new Error("Failed to update membership.");
  }
}

/**
 * Deletes a membership record by its ID for the authenticated user.
 * @param id - The ID of the membership record to delete.
 * @returns The deleted membership record.
 * @throws Error if user is not authenticated, record not found, or deletion fails.
 */
export async function deleteMembership(id: string): Promise<Membership> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated. Cannot delete membership.");
  }
  try {
    // Optional: Verify ownership before delete, though `where` clause handles it.
     const existingMembership = await prisma.membership.findUnique({
        where: { id: id, ownerId: userId },
    });
    if (!existingMembership) {
        throw new Error("Membership not found or permission denied.");
    }

    return await prisma.membership.delete({
      where: {
        id: id,
        ownerId: userId, // Ensure the user owns this membership
      },
    });
  } catch (error) {
    console.error("Error deleting membership:", error);
    if (error instanceof Error && error.message.includes("permission denied")) {
        throw error;
     }
    // Handle specific Prisma errors like P2025 (Record not found) if needed
    throw new Error("Failed to delete membership.");
  }
}

// Add other specific find functions if needed, e.g., find by type, status, etc.
// Example:
/*
export async function findMembershipsByType(type: MembershipType): Promise<Membership[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated.");
  }
  try {
    return await prisma.membership.findMany({
      where: {
        ownerId: userId,
        type: type, // Assuming a 'type' field exists on the Membership model
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error(`Error finding memberships by type ${type}:`, error);
    return [];
  }
}
*/
