import { auth } from "@clerk/nextjs/server";
import HomeClientPage from "./page.client";

export default async function HomePage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return <HomeClientPage></HomeClientPage>
}
