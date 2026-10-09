import type { Metadata } from "next"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { ProjectsSection } from "@/components/sections/projects"
import { PhotoGallerySection } from "@/components/sections/photo-gallery"
import { VideoShowcase } from "@/components/sections/video-showcase"
import { ContactSection } from "@/components/sections/contact"

import {
  getHomePageData,
} from "@/lib/content/home"

const homeDescription =
  "Deshawn Goodwyn's official website — exploring technology, music, athletics, and the work connecting them."

export const metadata: Metadata = {
  title: {
    absolute:
      "Deshawn Goodwyn | Build · Music · Life",
  },

  description: homeDescription,

  alternates: {
    canonical: "/",
  },
}

export default async function Home() {
  const {
    navigation,
    hero,
    projects,
    about,
    videos,
    photos,
    contact,
  } = await getHomePageData()

  return (
    <>
      <Navbar
        logo={navigation.logo}
        linkedinUrl={
          navigation.linkedinUrl
        }
      />

      <main id="main-content">
        <HeroSection
          backgroundImage={
            hero.backgroundImage
          }
          description={
            hero.description
          }
        />

        <ProjectsSection
          projects={projects}
        />

        <AboutSection
          {...about}
        />

        <PhotoGallerySection
          photos={photos}
        />

        <VideoShowcase
          videos={videos}
        />

        <ContactSection
          {...contact}
        />
      </main>

      <Footer />
    </>
  )
}