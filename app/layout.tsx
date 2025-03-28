import type { Metadata } from 'next'
import React from 'react'

import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/lib/mergeOpenGraph'
import { GoogleTagManager } from '@next/third-parties/google'
import {
  ClerkProvider,
} from '@clerk/nextjs'

import './globals.css'
import { getServerSideURL } from '@/lib/getURL'
import appConfig from '@/app/webchat.config'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await appConfig
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <GoogleTagManager gtmId={config.gtm.id} />
        <head>
          <InitTheme />
          <link href="/favicon.ico" rel="icon" sizes="32x32" />
          <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@NaviAgent',
  },
}
