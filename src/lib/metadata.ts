import { Metadata } from "next"
import { getBaseUrl } from "@/lib/config"
import { DEFAULT_METADATA } from "@/lib/constants"

interface MetadataProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article" | "book" | "profile"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function constructMetadata({
  title = DEFAULT_METADATA.title,
  description = DEFAULT_METADATA.description,
  image = "/og-image.png",
  url = getBaseUrl(),
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: MetadataProps = {}): Metadata {
  const safeDescription =
    description || title || "A personal blog built with Next.js"

  const normalizedBaseUrl = url.startsWith("http") ? url : `https://${url}`
  const metadataBase = new URL(normalizedBaseUrl)

  const absoluteImageUrl =
    image.startsWith("http") || image.startsWith("//")
      ? image
      : new URL(
          image.startsWith("/") ? image : `/${image}`,
          normalizedBaseUrl
        ).toString()

  const openGraph: Metadata["openGraph"] = {
    title,
    description: safeDescription,
    url: normalizedBaseUrl,
    siteName: DEFAULT_METADATA.siteName,
    locale: "en_US",
    type,
    images: [
      {
        url: absoluteImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    ...(type === "article" && {
      publishedTime,
      modifiedTime,
      authors,
    }),
  }

  return {
    title,
    description: safeDescription,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description: safeDescription,
      images: [absoluteImageUrl],
      creator: "@yourtwitterhandle",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    metadataBase,
  }
}
