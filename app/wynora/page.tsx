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
import { BookingSection } from "@/components/company/booking-section"
import { VideoShowcase } from "@/components/sections/video-showcase"
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

  // Fetch music-related videos for the video showcase (from main videos table)
  const { data: musicVideos } = await supabase
    .from("videos")
    .select("*")
    .eq("is_visible", true)
    .in("section", ["music", "piano", "worship"])
    .order("display_order")

  // Fetch TikTok thumbnails server-side to avoid CORS issues
  const videosWithThumbnails = await Promise.all(
    (silentPianistVideos || []).map(async (video) => {
      if (video.platform === "tiktok" && !video.thumbnail) {
        const username = video.tiktok_username || "TheSilentPianist"
        const url = `https://www.tiktok.com/@${username}/video/${video.embed_id}`
        try {
          const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
          })
          if (response.ok) {
            const data = await response.json()
            return { ...video, thumbnail: data.thumbnail_url || null }
          }
        } catch {
          // Silently fail
        }
      }
      return video
    })
  )

  // Also fetch thumbnails for music videos
  const musicVideosWithThumbnails = await Promise.all(
    (musicVideos || []).map(async (video) => {
      if (video.platform === "tiktok" && !video.thumbnail_url) {
        const username = video.tiktok_username || "TheSilentPianist"
        const videoId = video.youtube_id || video.embed_id
        const url = `https://www.tiktok.com/@${username}/video/${videoId}`
        try {
          const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
            next: { revalidate: 3600 }
          })
          if (response.ok) {
            const data = await response.json()
            return { ...video, thumbnail_url: data.thumbnail_url || null }
          }
        } catch {
          // Silently fail
        }
      }
      return video
    })
  )

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
      {videosWithThumbnails && videosWithThumbnails.length > 0 && (
        <SilentPianist videos={videosWithThumbnails} />
      )}
      {musicVideosWithThumbnails && musicVideosWithThumbnails.length > 0 && (
        <VideoShowcase videos={musicVideosWithThumbnails} />
      )}
      <CompanyServices company={company} services={services || []} />
      <CompanyPortfolio company={company} portfolio={portfolio || []} />
      <CompanyTestimonials company={company} testimonials={testimonials || []} />
      <BookingSection 
        companyName={company.name} 
        primaryColor={company.primary_color} 
        schedulingUrl={company.scheduling_url} 
      />
      <CompanyContact company={company} faqs={faqs || []} />
      <CompanyFooter company={company} />
    </main>
  )
}
