import { prisma } from "@/lib/db"
import { getBaseUrl } from "@/lib/config"
import { DEFAULT_METADATA } from "@/lib/constants"

export const dynamic = "force-static"
export const revalidate = 3600

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function formatRSSDate(date: Date): string {
  return date.toUTCString()
}

export async function GET() {
  const baseUrl = getBaseUrl()
  const siteName = DEFAULT_METADATA.siteName
  const siteDescription = DEFAULT_METADATA.description

  // Fetch published posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 20, // Limit to latest 20 posts
    include: {
      categories: true,
      tags: true,
    },
  })

  const rssItems = posts
    .map(post => {
      const postUrl = `${baseUrl}/blog/${post.slug}`
      const pubDate = post.publishedAt || post.createdAt
      const description = post.excerpt || ""

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${formatRSSDate(pubDate)}</pubDate>
    <author>${escapeXml(post.authorName || "Unknown")}</author>
    ${post.coverImage ? `<enclosure url="${post.coverImage}" type="image/jpeg" />` : ""}
  </item>`
    })
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-US</language>
    <lastBuildDate>${formatRSSDate(new Date())}</lastBuildDate>
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
