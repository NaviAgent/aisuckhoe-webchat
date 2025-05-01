import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
]);
const isOnboardingRoute = createRouteMatcher(["/auth/onboarding(.*)"]);

export const onboardingMiddleware = clerkMiddleware(async (auth, req) => {
  // For users visiting public route don't try to redirect
  if (!isPublicRoute(req) && !isOnboardingRoute(req)) {
    const { userId } = await auth();
    const client = await clerkClient();
    if (userId) {
      const res = await client.users.getUser(userId!);
      // Catch users who do not have `onboardingComplete: true` in their publicMetadata
      // Redirect them to the /onboading route to complete onboarding
      if (!res?.publicMetadata?.["onboardingComplete"]) {
        const onboardingUrl = new URL("/auth/onboarding", req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }
  }
});
