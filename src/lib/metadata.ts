import { Metadata } from "next"

interface MetadataProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article" | "book" | "profile"
}

export function constructMetadata({
  title = "My Blog",
  description = "A personal blog built with Next.js",
  image = "/og-image.png", // default OG image
  url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  type = "website",
}: MetadataProps = {}): Metadata {
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: title,
      locale: "en_US",
      type: type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [image],
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
    metadataBase: new URL(url),
  }
}
