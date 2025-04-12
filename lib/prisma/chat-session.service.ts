"use server";
import { prisma } from "./client";
import { ChatSession } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

// Adjusted the type for 'data' to only require fields needed from the caller
export async function createChatSession(
  data: { name: string; profileId: string } & Partial<Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt' | 'ownerId' | 'name' | 'profileId'>>
): Promise<ChatSession> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.chatSession.create({
      data: {
        ...data,
        ownerId: userId,
      },
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw new Error("Failed to create chat session");
  }
}

export async function getChatSessionById(
  id: string
): Promise<ChatSession | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.chatSession.findUnique({
      where: {
        id: id,
        ownerId: userId,
      },
    });
  } catch (error) {
    console.error("Error getting chat session by id:", error);
    return null; // Or throw an error, depending on your error handling strategy
  }
}
export async function getAllChatSessions(): Promise<ChatSession[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.chatSession.findMany({
      where: {
        ownerId: userId,
      },
    });
  } catch (error) {
    console.error("Error getting all chat sessions:", error);
    return []; // Or throw an error, depending on your error handling strategy
  }
}
export async function getAllChatSessionsByProfile(
  profileId: string
): Promise<ChatSession[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.chatSession.findMany({
      where: {
        ownerId: userId,
        profileId: profileId,
      },
    });
  } catch (error) {
    console.error("Error getting all chat sessions by profile:", error);
    return []; // Or throw an error, depending on your error handling strategy
  }
}

export async function updateChatSession(
  id: string,
  data: Partial<ChatSession>
): Promise<ChatSession> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.chatSession.update({
      where: {
        id: id,
        ownerId: userId,
      },
      data,
    });
  } catch (error) {
    console.error("Error updating chat session:", error);
    throw new Error("Failed to update chat session");
  }
}

export async function deleteChatSession(id: string): Promise<ChatSession> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    return await prisma.chatSession.delete({
      where: {
        id: id,
        ownerId: userId,
      },
    });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    throw new Error("Failed to delete chat session");
  }
}
