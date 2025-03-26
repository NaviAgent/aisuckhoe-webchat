import { prisma } from "./client";
import { ChatSession } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export const ChatSessionService = {
  async createChatSession(
    data: Omit<ChatSession, "id" | "createdAt" | "updatedAt">
  ): Promise<ChatSession> {
    const { userId } = await auth();
    return prisma.chatSession.create({
      data: {
        ...data,
        ownerId: userId!,
      },
    });
  },

  async getChatSessionById(id: string): Promise<ChatSession | null> {
    const { userId } = await auth();
    return prisma.chatSession.findUnique({
      where: {
        id: id,
        ownerId: userId!,
      },
    });
  },

  async getAllChatSessions(): Promise<ChatSession[]> {
    const { userId } = await auth();
    return prisma.chatSession.findMany({
      where: {
        ownerId: userId!,
      },
    });
  },

  async getAllChatSessionsByProfile(profileId: string): Promise<ChatSession[]> {
    const { userId } = await auth();
    return prisma.chatSession.findMany({
      where: {
        ownerId: userId!,
        profileId: profileId,
      },
    });
  },

  async updateChatSession(
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
  },

  async deleteChatSession(id: string): Promise<ChatSession> {
    const { userId } = await auth();
    return prisma.chatSession.delete({
      where: {
        id: id,
        ownerId: userId!,
      },
    });
  },
};
