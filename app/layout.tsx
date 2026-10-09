import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://deshawngoodwyn.com"

const siteDescription =
  "The official website of Deshawn Goodwyn — work, music, life, and the ideas connecting them."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  applicationName: "Deshawn Goodwyn",

  title: {
    default: "Deshawn Goodwyn",
    template: "%s | Deshawn Goodwyn",
  },

  description: siteDescription,

  authors: [
    {
      name: "Deshawn Goodwyn",
      url: siteUrl,
    },
  ],

  creator: "Deshawn Goodwyn",
  publisher: "Deshawn Goodwyn",

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

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Deshawn Goodwyn",
    title: "Deshawn Goodwyn",
    description: siteDescription,
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Deshawn Goodwyn",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Deshawn Goodwyn",
    description: siteDescription,
    images: ["/og-image"],
    creator: "@dgoodwyn",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",

  colorScheme: "dark light",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0a0a0a",
    },
  ],
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,

      name: "Deshawn Goodwyn",
      url: siteUrl,
      image: `${siteUrl}/og-image`,
      description: siteDescription,

      sameAs: [
        "https://twitter.com/dgoodwyn",
        "https://linkedin.com/in/deshawngoodwyn",
        "https://github.com/dgoodwyn",
      ],

      knowsAbout: [
        "Software Engineering",
        "Web Development",
        "Product Development",
        "Piano",
        "Music",
        "Basketball",
      ],

      affiliation: [
        {
          "@type": "Organization",
          name: "Wyntech",
          url: `${siteUrl}/wyntech`,
        },
        {
          "@type": "Organization",
          name: "Wynora",
          url: `${siteUrl}/wynora`,
        },
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,

      url: siteUrl,
      name: "Deshawn Goodwyn",
      description: siteDescription,

      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
}

const serializedStructuredData = JSON.stringify(structuredData).replace(
  /</g,
  "\\u003c",
)

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializedStructuredData,
          }}
        />
      </head>

      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-24 bg-foreground px-4 py-3 text-sm font-medium text-background transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}