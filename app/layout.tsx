import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { DM_Sans, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TextIcon } from "lucide-react"
import Link from "next/link"
import { GithubButton } from "@/components/github-button"
import { ModeToggle } from "@/components/mode-toggle"
import { Providers } from "@/components/providers"
import { RegistrySetup } from "@/components/registry-setup"
import { Separator } from "@/registry/ai-tools/ui/separator"
import { Toaster } from "@/registry/ai-tools/ui/sonner"

const fontSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

const GeistSans = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const title = "AI Tools Registry"
const description =
  "A registry distributing AI Tools and components using shadcn."

export const metadata: Metadata = {
  title: {
    default: `${title} | ${description}`,
    template: "%s | AI Tools",
  },
  description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  manifest: `${process.env.NEXT_PUBLIC_BASE_URL}/site.webmanifest`,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${GeistSans.variable} font-sans antialiased`}
      >
        <Providers>
          <header>
            <div className="max-w-7xl mx-auto flex items-center px-4 py-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-baseline gap-1">
                  <TextIcon /> <span className="font-bold">AI Ecom Tools</span>
                </Link>
                <Separator orientation="vertical" className="!h-6" />
                <p className="text-muted-foreground hidden md:block line-clamp-1 text-sm">
                  Tool definitions and components for the AI SDK.
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <RegistrySetup />
                <GithubButton />
                <ModeToggle />
              </div>
            </div>
          </header>
          {children}
          <Toaster position="top-center" />
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
