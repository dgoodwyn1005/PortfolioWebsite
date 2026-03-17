import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://deshawngoodwyn.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Deshawn Goodwyn | D2 Basketball · WynTech Founder · Gospel Pianist · Full-Stack Developer",
    template: "%s | Deshawn Goodwyn",
  },
  description:
    "Former Virginia HS 3-point record holder, 4.56 GPA student-athlete, full-stack developer, and gospel pianist. Explore my projects, music, and basketball journey.",
  keywords: [
    "Deshawn Goodwyn",
    "D2 Basketball",
    "WynTech Solutions",
    "Wynora Music",
    "Full-Stack Developer",
    "Gospel Pianist",
    "Virginia Basketball",
    "Student Athlete",
    "Web Development",
    "Music Production",
  ],
  authors: [{ name: "Deshawn Goodwyn", url: siteUrl }],
  creator: "Deshawn Goodwyn",
  publisher: "Deshawn Goodwyn",
  generator: "v0.app",
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
    url: siteUrl,
    siteName: "Deshawn Goodwyn",
    title: "Deshawn Goodwyn | D2 Basketball · WynTech Founder · Gospel Pianist",
    description:
      "Former Virginia HS 3-point record holder, 4.56 GPA student-athlete, full-stack developer, and gospel pianist.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Deshawn Goodwyn - Athlete, Developer, Musician",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deshawn Goodwyn | D2 Basketball · WynTech Founder · Gospel Pianist",
    description:
      "Former Virginia HS 3-point record holder, 4.56 GPA student-athlete, full-stack developer, and gospel pianist.",
    images: ["/og-image.jpg"],
    creator: "@dgoodwyn",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "portfolio",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Deshawn Goodwyn",
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    sameAs: [
      "https://twitter.com/dgoodwyn",
      "https://linkedin.com/in/deshawngoodwyn",
      "https://github.com/dgoodwyn",
    ],
    jobTitle: "Full-Stack Developer & Entrepreneur",
    worksFor: [
      {
        "@type": "Organization",
        name: "WynTech Solutions",
        url: `${siteUrl}/wyntech`,
      },
      {
        "@type": "Organization",
        name: "Wynora Music Services",
        url: `${siteUrl}/wynora`,
      },
    ],
    knowsAbout: ["Web Development", "Basketball", "Piano", "Music Production", "Software Engineering"],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Virginia High School",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
