import { auth } from "@clerk/nextjs/server";
import { useI18n } from "../i18n";

export default async function HomePage() {
  const t = useI18n()
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  return t('error.notfound')
}
