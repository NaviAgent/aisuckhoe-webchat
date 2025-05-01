import "@/globals.css";
import { getServerSideURL } from "@/lib/getURL";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import { AppProps } from "next/app";

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@NaviAgent",
  },
};


function AuthApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClerkProvider
        appearance={{
          variables: { colorPrimary: "#000000" },
          elements: {
            formButtonPrimary:
              "bg-black border border-black border-solid hover:bg-white hover:text-black",
            socialButtonsBlockButton:
              "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black",
            socialButtonsBlockButtonText: "font-semibold",
            formButtonReset:
              "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
            membersPageInviteButton:
              "bg-black border border-black border-solid hover:bg-white hover:text-black",
            card: "bg-[#fafafa]",
          },
        }}
      >
        <Component {...pageProps} />
      </ClerkProvider>

      {/* <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" /> */}
      {/* <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" /> */}
    </>
  );
}

export default AuthApp;