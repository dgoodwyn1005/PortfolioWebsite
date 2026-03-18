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

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PhotoGallerySection />
      <VenturesSection />
      <VideoShowcase videos={videos || []} />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
