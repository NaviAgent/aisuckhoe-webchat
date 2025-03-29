'use server'

import { createProfile } from '@/lib/prisma/profile.service'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { Profile } from '@prisma/client'

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

    await createProfile({ ...profile, metadata: profile.metadata || {} })

    return { message: res.publicMetadata };
  } catch (err) {
    console.log(err);
    return { error: 'There was an error updating the user metadata.' }
  }
}
