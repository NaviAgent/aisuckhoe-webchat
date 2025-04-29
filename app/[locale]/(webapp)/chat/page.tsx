import { auth } from "@clerk/nextjs/server";
import ChatClientPage from "./page.client";

export default async function ChatPage() {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  return <ChatClientPage></ChatClientPage>;
}
