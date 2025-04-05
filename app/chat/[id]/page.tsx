import { auth } from "@clerk/nextjs/server";
import ChatIdClientPage from "./page.client";

export default async function ChatIdPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return <ChatIdClientPage></ChatIdClientPage>;
}
