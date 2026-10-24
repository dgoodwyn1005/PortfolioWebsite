import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import "@fontsource-variable/inter"
import "@fontsource-variable/geist-mono"
import { Analytics } from "@vercel/analytics/next"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.deshawngoodwyn.com"

const siteDescription =
  "The official website of Deshawn Goodwyn — software, music, athletics, ventures, and the work connecting them."

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

  icons: {
    icon: [
      {
        url: "/apple-icon.png",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
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

  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Deshawn Goodwyn",
    title: "Deshawn Goodwyn | Build · Music · Life",
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Deshawn Goodwyn — Build, Music, Life",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Deshawn Goodwyn | Build · Music · Life",
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
        "https://github.com/dgoodwyn1005",
      ],

      knowsAbout: [
        "Software Engineering",
        "Web Development",
        "Product Development",
        "Piano Performance",
        "Music",
        "Basketball",
      ],

      affiliation: [
        {
          "@id": `${siteUrl}/wyntech#organization`,
        },
        {
          "@id": `${siteUrl}/wynora#organization`,
        },
      ],
    },

    {
      "@type": "Organization",
      "@id": `${siteUrl}/wyntech#organization`,
      name: "Wyntech",
      url: `${siteUrl}/wyntech`,
      founder: {
        "@id": `${siteUrl}/#person`,
      },
      description:
        "Websites, software, automation, and digital products built through Wyntech by Deshawn Goodwyn.",
    },

    {
      "@type": "Organization",
      "@id": `${siteUrl}/wynora#organization`,
      name: "Wynora",
      url: `${siteUrl}/wynora`,
      founder: {
        "@id": `${siteUrl}/#person`,
      },
      description:
        "Piano performance, accompaniment, arrangements, recording, and professional music services through Wynora by Deshawn Goodwyn.",
    },

    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,

      url: siteUrl,
      name: "Deshawn Goodwyn",
      description: siteDescription,
      inLanguage: "en-US",

      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },

    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile-page`,
      url: siteUrl,
      name: "Deshawn Goodwyn | Build · Music · Life",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      mainEntity: {
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
      className="font-variables"
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
