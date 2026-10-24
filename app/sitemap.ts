import type { MetadataRoute } from "next"

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.deshawngoodwyn.com"
).replace(/\/$/, "")

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/build` },
    { url: `${siteUrl}/music` },
    { url: `${siteUrl}/life` },
    { url: `${siteUrl}/wyntech` },
    { url: `${siteUrl}/wynora` },
  ]
}
