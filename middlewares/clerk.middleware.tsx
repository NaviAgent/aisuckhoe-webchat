import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/auth(.*)'])

export const authMiddleware = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    console.log('authMiddleware.homeUrl', req.url)

    await auth.protect()
  }
})

