import type { Metadata } from "next";
import { mergeOpenGraph } from "./mergeOpenGraph";
import { getServerSideURL } from "./getURL";

type ImageType = {
  url: string;
  sizes?: {
    og?: {
      url?: string;
    };
  };
};

const getImageURL = (image?: ImageType) => {
  const serverUrl = getServerSideURL();

  let url = serverUrl + "/website-template-OG.webp";

  if (image && typeof image === "object" && "url" in image) {
    const ogUrl = image.sizes?.og?.url;

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url;
  }

  return url;
};

export const generateMeta = async (args: {
  doc: Partial<{
    slug: string;
    meta: Partial<{ image: ImageType; description: string; title: string; }>;
  }> | null;
}): Promise<Metadata> => {
  const { doc } = args;

  const ogImage = getImageURL(doc?.meta?.image);

  const title = doc?.meta?.title
    ? doc?.meta?.title + " | AI sức khoẻ"
    : "AI sức khoẻ";

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || "",
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join("/") : "/",
    }),
    title,
  };
};
