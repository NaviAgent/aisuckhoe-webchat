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
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();
  if (userId) {
    const client = await clerkClient();

    const res = await client.users.getUser(userId!);

    // Catch users who do not have `onboardingComplete: true` in their publicMetadata
    // Redirect them to the /onboading route to complete onboarding
    if (
      res &&
      !res.publicMetadata?.["onboardingComplete"] &&
      !isOnboardingRoute(req)
    ) {
      const onboardingUrl = new URL("/auth/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});
