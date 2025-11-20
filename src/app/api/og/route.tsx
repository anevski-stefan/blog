import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Dynamic params
    const title = searchParams.get("title") ?? "My Blog"
    const description =
      searchParams.get("description") ?? "A personal blog built with Next.js"
    const type = searchParams.get("type") ?? "article"

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "40px 80px",
          }}
        >
          {/* Type badge */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "40px",
              backgroundColor: "#e2e8f0",
              color: "#475569",
              padding: "8px 16px",
              borderRadius: "9999px",
              fontSize: "14px",
              textTransform: "capitalize",
            }}
          >
            {type}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "60px",
              fontWeight: "bold",
              color: "black",
              marginBottom: "20px",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "30px",
              color: "#64748b",
              textAlign: "center",
              marginTop: "10px",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>

          {/* Site URL */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              color: "#94a3b8",
              fontSize: "16px",
            }}
          >
            {process.env.NEXT_PUBLIC_APP_URL || "yourblog.com"}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate image", { status: 500 })
  }
}
