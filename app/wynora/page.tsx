import { createClient } from "@/lib/supabase/server"
import { CompanyNavbar } from "@/components/company/navbar"
import { CompanyHero } from "@/components/company/hero"
import { CompanyAbout } from "@/components/company/about"
import { CompanyServices } from "@/components/company/services"
import { CompanyPortfolio } from "@/components/company/portfolio"
import { CompanyTestimonials } from "@/components/company/testimonials"
import { CompanyContact } from "@/components/company/contact"
import { CompanyFooter } from "@/components/company/footer"
import { MusicSection } from "@/components/company/music-section"
import { SilentPianist } from "@/components/company/silent-pianist"
import { AudioSamples } from "@/components/company/audio-samples"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wynora Music Services | Professional Piano & Recording",
  description: "Professional piano accompaniment, music recording, and arrangement services. Offering essential to luxury recording packages for musicians, vocalists, and performers.",
  keywords: ["Piano Accompaniment", "Music Recording", "Gospel Piano", "Music Arrangement", "Recording Studio", "Wynora"],
  openGraph: {
    title: "Wynora Music Services | Professional Piano & Recording",
    description: "Professional piano accompaniment, music recording, and arrangement services for musicians and performers.",
    type: "website",
    images: [{ url: "/og-wynora.jpg", width: 1200, height: 630, alt: "Wynora Music Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wynora Music Services",
    description: "Professional piano accompaniment, music recording, and arrangement services.",
  },
}

export default async function WynoraPage() {
  const supabase = await createClient()

  const { data: company } = await supabase.from("companies").select("*").eq("slug", "wynora").single()

  if (!company) {
    notFound()
  }

  const { data: services } = await supabase
    .from("company_services")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: portfolio } = await supabase
    .from("company_portfolio")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: testimonials } = await supabase
    .from("company_testimonials")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: faqs } = await supabase
    .from("company_faqs")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: audioClips } = await supabase
    .from("audio_clips")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: silentPianistVideos } = await supabase
    .from("silent_pianist_videos")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  const { data: audioSamples } = await supabase
    .from("audio_samples")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  return (
    <main className="min-h-screen">
      <CompanyNavbar company={company} />
      <CompanyHero company={company} />
      <CompanyAbout company={company} />
      {audioSamples && audioSamples.length > 0 && (
        <AudioSamples samples={audioSamples} />
      )}
      {audioClips && audioClips.length > 0 && (
        <MusicSection clips={audioClips} companyName={company.name} />
      )}
      {silentPianistVideos && silentPianistVideos.length > 0 && (
        <SilentPianist videos={silentPianistVideos} />
      )}
      <CompanyServices company={company} services={services || []} />
      <CompanyPortfolio company={company} portfolio={portfolio || []} />
      <CompanyTestimonials company={company} testimonials={testimonials || []} />
      <CompanyContact company={company} faqs={faqs || []} />
      <CompanyFooter company={company} />
    </main>
  )
}
