import { Metadata } from "next"

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
  title = "My Blog",
  description = "A personal blog built with Next.js",
  image = "/og-image.png", // default OG image
  url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: MetadataProps = {}): Metadata {
  const safeDescription =
    description || title || "A personal blog built with Next.js"

  const absoluteImageUrl =
    image.startsWith("http") || image.startsWith("//")
      ? image
      : image.startsWith("/")
        ? `${url}${image}`
        : `${url}/${image}`

  const absoluteUrl = url.startsWith("http") ? url : `https://${url}`
  const baseUrl = url.startsWith("http") ? url : `https://${url}`
  const metadataBase = new URL(baseUrl)

  const openGraph: Metadata["openGraph"] = {
    title: title,
    description: safeDescription,
    url: absoluteUrl,
    siteName: "My Blog",
    locale: "en_US",
    type: type,
    images: [
      {
        url: absoluteImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    ...(type === "article" && {
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: authors,
    }),
  }

  return {
    title: title,
    description: safeDescription,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: title,
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
