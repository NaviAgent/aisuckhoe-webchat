import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return '404 error'
}
