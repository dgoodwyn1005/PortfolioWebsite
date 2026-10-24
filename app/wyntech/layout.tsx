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
      "@id": `${siteUrl}/wyntech#organization`,
      name: "Wyntech",
      url: `${siteUrl}/wyntech`,
      description:
        "Websites, software, automation, and digital products built through Wyntech by Deshawn Goodwyn.",
      founder: { "@id": `${siteUrl}/#person` },
      knowsAbout: [
        "Web Design",
        "Web Development",
        "Software Development",
        "Automation",
        "E-Commerce",
        "Digital Products",
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/wyntech#webpage`,
      url: `${siteUrl}/wyntech`,
      name: "Wyntech | Websites, Software & Digital Products",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/wyntech#organization` },
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
          name: "Wyntech",
          item: `${siteUrl}/wyntech`,
        },
      ],
    },
  ],
}

export default function WyntechLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData data={structuredData} />
      {children}
    </>
  )
}
