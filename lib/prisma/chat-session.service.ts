"use server";
import { prisma } from "./client";
import { ChatSession } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function createChatSession(
  data: Omit<ChatSession, "id" | "createdAt" | "updatedAt">
): Promise<ChatSession> {
  const { userId } = await auth();
  return prisma.chatSession.create({
    data: {
      ...data,
      ownerId: userId!,
    },
  });
}

export async function getChatSessionById(
  id: string
): Promise<ChatSession | null> {
  const { userId } = await auth();
  return prisma.chatSession.findUnique({
    where: {
      id: id,
      ownerId: userId!,
    },
  });
}
export async function getAllChatSessions(): Promise<ChatSession[]> {
  const { userId } = await auth();
  return prisma.chatSession.findMany({
    where: {
      ownerId: userId!,
    },
  });
}
export async function getAllChatSessionsByProfile(
  profileId: string
): Promise<ChatSession[]> {
  const { userId } = await auth();
  return prisma.chatSession.findMany({
    where: {
      ownerId: userId!,
      profileId: profileId,
    },
  });
}

export async function updateChatSession(
  id: string,
  data: Partial<ChatSession>
): Promise<ChatSession> {
  const { userId } = await auth();
  return prisma.chatSession.update({
    where: {
      id: id,
      ownerId: userId!,
    },
    data,
  });
}

export async function deleteChatSession(id: string): Promise<ChatSession> {
  const { userId } = await auth();
  return prisma.chatSession.delete({
    where: {
      id: id,
      ownerId: userId!,
    },
  });
}
