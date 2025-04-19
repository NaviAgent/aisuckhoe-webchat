"use client";

import { ReactNode } from "react";
import { I18nProviderClient } from "."; // Import from the index file we created

type Props = {
  locale: string;
  children: ReactNode;
};

export default function I18nProvider({ locale, children }: Props) {
  return (
    <I18nProviderClient locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProviderClient>
  );
}
