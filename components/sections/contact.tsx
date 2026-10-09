import {
  ContactContent,
} from "@/components/contact-content"

import type {
  ContactData,
} from "@/lib/content/site"

export function ContactSection({
  settings,
  socialLinks,
}: ContactData) {
  return (
    <ContactContent
      settings={settings}
      socialLinks={socialLinks}
    />
  )
}