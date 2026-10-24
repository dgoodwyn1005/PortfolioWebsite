import type { ReactNode } from "react"

import { StructuredData } from "@/components/seo/structured-data"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.deshawngoodwyn.com"

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/wynora#organization`,
      name: "Wynora",
      url: `${siteUrl}/wynora`,
      description:
        "Live piano performance, accompaniment, recording, arrangements, and professional music services through Wynora by Deshawn Goodwyn.",
      founder: { "@id": `${siteUrl}/#person` },
      knowsAbout: [
        "Live Piano",
        "Piano Performance",
        "Piano Accompaniment",
        "Music Arrangement",
        "Piano Recording",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/wynora#webpage`,
      url: `${siteUrl}/wynora`,
      name: "Wynora | Piano, Performance & Music Services",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/wynora#organization` },
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
          name: "Wynora",
          item: `${siteUrl}/wynora`,
        },
      ],
    },
  ],
}

export default function WynoraLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData data={structuredData} />
      {children}
    </>
  )
}
