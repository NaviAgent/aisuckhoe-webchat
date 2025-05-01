import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { onboardingMiddleware } from "./middlewares/onboarding.middleware";
import { createI18nMiddleware } from "next-international/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const I18nMiddleware = createI18nMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "vi",
  urlMappingStrategy: "rewrite", // Keeps locale in URL path e.g. /vi/chat
});

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
]);

export default clerkMiddleware(
  async (auth, request: NextRequest, event: NextFetchEvent) => {
    // 1. Run i18n middleware first
    // const i18nResponse = I18nMiddleware(request);
    // if (i18nResponse) return i18nResponse;

    // 2. Run auth middleware
    // Note: Clerk's authMiddleware might handle async internally or expect direct return
    if (!isPublicRoute(request)) {
      await auth.protect();
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
