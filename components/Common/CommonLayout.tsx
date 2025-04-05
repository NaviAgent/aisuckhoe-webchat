import type { Metadata } from "next";
import React from "react";

import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import ChatSidebar from "@/components/Chat/ChatSideBar";
import { getServerSideURL } from "@/lib/getURL";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen bg-background">
      <div className="hidden md:flex">
        <ChatSidebar />
      </div>

      <div className="w-full">{children}</div>
    </div>
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
