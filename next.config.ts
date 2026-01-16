import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Security: Only allow images from trusted domains
    // Add additional domains here as needed
  },
}

export default nextConfig
