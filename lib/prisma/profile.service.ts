"use server";
import { prisma } from "./client";
import { Profile } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function createProfile(
  data: Omit<Profile, "id" | "createdAt" | "updatedAt">
): Promise<Profile> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to create profiles");
  }
  return prisma.profile.create({
    data: {
      ...data,
      ownerId: userId!,
      metadata: data.metadata || {}
    },
  });
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get profiles");
  }
  return prisma.profile.findUnique({
    where: {
      id: id,
      ownerId: userId!,
    },
  });
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to get profiles");
  }
  return prisma.profile.findMany({
    where: {
      ownerId: userId!,
    },
  });
}

export async function updateProfile(
  id: string,
  data: Partial<Profile>
): Promise<Profile> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to update profiles");
  }
  return prisma.profile.update({
    where: { id: id, ownerId: userId! },
    data: {
      ...data,
      metadata: data.metadata || {}
    },
  });
}

export async function deleteProfile(id: string): Promise<Profile> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to delete");
  }
  return prisma.profile.delete({
    where: { id: id, ownerId: userId! },
  });
}
