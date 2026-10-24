import type { Metadata } from "next"
import type { ReactNode } from "react"

import { StructuredData } from "@/components/seo/structured-data"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.deshawngoodwyn.com"

const title = "Life | Athletics, Education & Story | Deshawn Goodwyn"
const description =
  "Athletics, education, milestones, experiences, and the evolving personal story of Deshawn Goodwyn."

export const metadata: Metadata = {
  openGraph: {
    title,
    description,
    url: `${siteUrl}/life`,
    siteName: "Deshawn Goodwyn",
    type: "website",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "Deshawn Goodwyn — Life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image"],
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl}/life#webpage`,
      url: `${siteUrl}/life`,
      name: title,
      description,
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Life",
          item: `${siteUrl}/life`,
        },
      ],
    },
  ],
}

export default function LifeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData data={structuredData} />
      {children}
    </>
  )
}
