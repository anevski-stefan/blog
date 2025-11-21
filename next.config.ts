import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Note: Allowing all domains for blog flexibility
    // Consider restricting to specific domains in production for better security
  },
}

export default nextConfig
