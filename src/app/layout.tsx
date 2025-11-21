import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { constructMetadata } from "@/lib/metadata"
import "./globals.css"

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <Toaster />
      </body>
    </html>
  )
}
