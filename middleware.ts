import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/clerk.middleware";
import { onboardingMiddleware } from "./middlewares/onboarding.middleware";
import { createI18nMiddleware } from "next-international/middleware";
import { clerkMiddleware } from "@clerk/nextjs/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "vi",
  urlMappingStrategy: "rewrite", // Keeps locale in URL path e.g. /vi/chat
});

export default clerkMiddleware(
  async (auth, request: NextRequest, event: NextFetchEvent) => {
    // 1. Run i18n middleware first
    const i18nResponse = I18nMiddleware(request);
    // If i18n redirects or rewrites, return its response
    if (i18nResponse) return i18nResponse;

    // 2. Run auth middleware
    // Note: Clerk's authMiddleware might handle async internally or expect direct return
    const authResult = await authMiddleware(request, event);
    if (authResult instanceof NextResponse) {
      // If auth middleware returned a synchronous response
      return authResult;
    }

    // 3. If auth passed synchronously without returning a response, run onboarding
    const onboardingResult = await onboardingMiddleware(request, event);
    if (onboardingResult instanceof NextResponse) {
      return onboardingResult;
    }

    // 4. If all middlewares passed without returning a response, continue
    return NextResponse.next();
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
