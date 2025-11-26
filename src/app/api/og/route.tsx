import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"
import { getBaseUrl } from "@/lib/config"
import { DEFAULT_METADATA } from "@/lib/constants"
import { createLogger } from "@/lib/logger"

const logger = createLogger("OGImageAPI")

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.get("title") ?? DEFAULT_METADATA.title
    const description =
      searchParams.get("description") ?? DEFAULT_METADATA.description
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
            {new URL(getBaseUrl()).hostname}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    logger.error(
      "Failed to generate OG image",
      e instanceof Error ? e : undefined,
      {
        url: req.url,
      }
    )
    return new Response("Failed to generate image", { status: 500 })
  }
}
