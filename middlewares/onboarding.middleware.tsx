import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/auth(.*)'])
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])

export const onboardingMiddleware = clerkMiddleware(async (auth, req) => {
  // For users visiting public route don't try to redirect
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  const { userId, sessionClaims } = await auth()

  // Catch users who do not have `onboardingComplete: true` in their publicMetadata
  // Redirect them to the /onboading route to complete onboarding
  if (userId && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if (userId && isOnboardingRoute(req)) {
    const homeUrl = new URL('/', req.url)
    return NextResponse.redirect(homeUrl)
  }
})