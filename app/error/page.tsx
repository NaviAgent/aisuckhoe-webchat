'use client';
import { useI18n } from "../i18n";

export default function ErrorPage() {
  const t = useI18n();
  return t("error.notfound");
}
