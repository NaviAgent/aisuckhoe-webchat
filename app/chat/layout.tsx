import type { Metadata } from "next";
import React from "react";

import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
// import { GoogleTagManager } from '@next/third-parties/google'
import { getServerSideURL } from "@/lib/getURL";

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@NaviAgent",
  },
};
