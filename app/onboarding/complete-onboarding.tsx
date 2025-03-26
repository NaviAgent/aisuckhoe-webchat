'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { PrismaClient, Profile } from '@prisma/client'

const prisma = new PrismaClient()

export const completeOnboarding = async (profile: Profile) => {
  const { userId } = await auth()

  if (!userId) {
    return { message: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })

    await prisma.profile.create({
      data: { ...profile, metadata: profile.metadata || {} }
    });

    return { message: res.publicMetadata };
  } catch (err) {
    console.log(err);
    return { error: 'There was an error updating the user metadata.' }
  }
}
