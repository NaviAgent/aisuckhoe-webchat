"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export type UserPublicMetadata = {
  onboardingComplete: true;
};

export async function updateUserMetadata(metadata: UserPublicMetadata) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No Logged In User" };
  }

  try {
    const client = await clerkClient();

    const res = await client.users.updateUser(userId, {
      publicMetadata: metadata,
    });
    return { data: res.publicMetadata };
  } catch (err) {
    console.log(err);
    return { error: "There was an error updating the user metadata." };
  }
}
