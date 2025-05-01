import type { Metadata } from "next";
import React from "react";

import { InitTheme } from "@/providers/Theme/InitTheme";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
// import { GoogleTagManager } from '@next/third-parties/google'
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { getServerSideURL } from "@/lib/getURL";
// import { getCurrentLocale } from "./i18n/server"; // Import server-side locale getter
import I18nProvider from "./i18n/provider"; // Import the client provider

// Make the component async to await getCurrentLocale
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = 'vi'
  return (
    <ClerkProvider>
      {/* Use the dynamic locale for the lang attribute */}
      <html lang={locale ?? "vi"} suppressHydrationWarning>
        {/* <GoogleTagManager gtmId={config.gtm.id} /> */}
        <head>
          <InitTheme />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        </head>
        <body>
          {/* Wrap children with the I18nProvider */}
          <I18nProvider locale={locale ?? "vi"}>{children}</I18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@NaviAgent",
  },
};
