import { AboutContent } from "@/components/about-content"

import type { AboutData } from "@/lib/content/site"

export function AboutSection({
  profileImage,
  aboutParagraph1,
  aboutParagraph2,
  aboutParagraph3,
  resumeUrl,
  stats,
}: AboutData) {
  return (
    <AboutContent
      profileImage={profileImage}
      aboutParagraph1={aboutParagraph1}
      aboutParagraph2={aboutParagraph2}
      aboutParagraph3={aboutParagraph3}
      resumeUrl={resumeUrl}
      stats={stats}
    />
  )
}