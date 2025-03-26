import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from './middlewares/clerk.middleware'
import { NextFetchEvent } from 'next/server'
import { onboardingMiddleware } from './middlewares/onboarding.middleware'


export default function middleware(request: NextRequest, event: NextFetchEvent) {
  // Thứ tự middleware quan trọng
  return authMiddleware(request, event)
    .then(() => onboardingMiddleware(request, event))
    .catch((error) => {
      console.error('Middleware error:', error)
      return NextResponse.redirect(new URL('/error', request.url))
    })
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};