import type { Metadata } from "next"
import { notFound } from "next/navigation"

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
import { DigitalProducts } from "@/components/company/digital-products"

import { VideoShowcase } from "@/components/sections/video-showcase"

import {
  getCompanyPageData,
  getWynoraMediaData,
} from "@/lib/content/companies"

const description =
  "Piano performance, accompaniment, arrangements, recording, and professional music services through Wynora by Deshawn Goodwyn."

export const metadata: Metadata = {
  title: {
    absolute:
      "Wynora | Piano, Performance & Music Services",
  },

  description,

  alternates: {
    canonical: "/wynora",
  },

  openGraph: {
    title:
      "Wynora | Piano, Performance & Music Services",

    description,

    type: "website",

    images: [
      {
        url: "/og-wynora.jpg",
        width: 1200,
        height: 630,
        alt: "Wynora",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Wynora | Piano, Performance & Music Services",

    description,
  },
}

export default async function WynoraPage() {
  const companyData =
    await getCompanyPageData(
      "wynora",
    )

  if (!companyData) {
    notFound()
  }

  const {
    company,
    services,
    portfolio,
    testimonials,
    faqs,
  } = companyData

  const {
    audioClips,
    silentPianistVideos,
    audioSamples,
    musicVideos,
  } = await getWynoraMediaData(
    company.id,
  )

  return (
    <>
      <CompanyNavbar
        company={company}
      />

      <main
        id="main-content"
        className="min-h-screen"
      >
        {/* Atmosphere + promise */}
        <CompanyHero
          company={company}
        />

        {/* Let them hear you before selling */}
        {audioSamples.length >
          0 && (
          <AudioSamples
            samples={audioSamples}
          />
        )}

        {/* What can they hire you for? */}
        <CompanyServices
          company={company}
          services={services}
        />

        {/* Performance proof */}
        {silentPianistVideos.length >
          0 && (
          <SilentPianist
            videos={
              silentPianistVideos
            }
          />
        )}

        {/* More selective media */}
        {musicVideos.length >
          0 && (
          <VideoShowcase
            videos={musicVideos}
          />
        )}

        {/* Projects / professional work */}
        {portfolio.length > 0 && (
          <CompanyPortfolio
            company={company}
            portfolio={portfolio}
          />
        )}

        {/* Social proof */}
        {testimonials.length >
          0 && (
          <CompanyTestimonials
            company={company}
            testimonials={
              testimonials
            }
          />
        )}

        {/* The person behind the work */}
        <CompanyAbout
          company={company}
        />

        {/* Main conversion */}
        <BookingSection
          companyName={
            company.name
          }
          primaryColor={
            company.primary_color
          }
          schedulingUrl={
            company.scheduling_url
          }
        />

        {/* Deeper listening */}
        {audioClips.length > 0 && (
          <MusicSection
            clips={audioClips}
            companyName={
              company.name
            }
          />
        )}

        {/* Secondary revenue stream */}
        <DigitalProducts
          companyId={company.id}
          primaryColor={
            company.primary_color
          }
        />

        {/* Questions / custom inquiry */}
        <CompanyContact
          company={company}
          faqs={faqs}
        />
      </main>

      <CompanyFooter
        company={company}
      />
    </>
  )
}