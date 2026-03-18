import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { ProjectsSection } from "@/components/sections/projects"
import { VenturesSection } from "@/components/sections/ventures"
import { PhotoGallerySection } from "@/components/sections/photo-gallery"
import { VideoShowcase } from "@/components/sections/video-showcase"
import { ContactSection } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createClient()

  const { data: videos } = await supabase.from("videos").select("*").eq("is_visible", true).order("display_order")

  // Fetch TikTok thumbnails server-side to avoid CORS issues
  const videosWithThumbnails = await Promise.all(
    (videos || []).map(async (video) => {
      if (video.platform === "tiktok" && !video.thumbnail_url) {
        const username = video.tiktok_username || "TheSilentPianist"
        const videoId = video.youtube_id || video.embed_id
        const url = `https://www.tiktok.com/@${username}/video/${videoId}`
        try {
          const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
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
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PhotoGallerySection />
      <VenturesSection />
      <VideoShowcase videos={videosWithThumbnails} />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
