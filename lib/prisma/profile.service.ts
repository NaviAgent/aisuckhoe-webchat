"use server";
import { prisma } from "./client";
import { Profile } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export const ProfileService = {
  async createProfile(
    data: Omit<Profile, "id" | "createdAt" | "updatedAt">
  ): Promise<Profile> {
    const { userId } = await auth();
    return prisma.profile.create({
      data: {
        ...data,
        ownerId: userId!,
      },
    });
  },

  async getProfileById(id: string): Promise<Profile | null> {
    const { userId } = await auth();
    return prisma.profile.findUnique({
      where: {
        id: id,
        ownerId: userId!,
      },
    });
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { userId } = await auth();
    return prisma.profile.findMany({
      where: {
        ownerId: userId!,
      },
    });
  },

  async updateProfile(id: string, data: Partial<Profile>): Promise<Profile> {
    const { userId } = await auth();
    return prisma.profile.update({
      where: { id: id, ownerId: userId! },
      data,
    });
  },

  async deleteProfile(id: string): Promise<Profile> {
    const { userId } = await auth();
    return prisma.profile.delete({
      where: { id: id, ownerId: userId! },
    });
  },
};
