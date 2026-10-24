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
import { BookingSection } from "@/components/company/booking-section"

import {
  getCompanyPageData,
} from "@/lib/content/companies"

const title = "Wyntech | Web Design, Software & Automation"
const description =
  "Web design, website development, software, automation, e-commerce, and digital products built through Wyntech by Deshawn Goodwyn."

export const metadata: Metadata = {
  title: {
    absolute: title,
  },

  description,

  alternates: {
    canonical: "/wyntech",
  },

  openGraph: {
    title,
    description,
    url: "/wyntech",
    type: "website",
    images: [
      {
        url: "/og-wyntech.jpg",
        width: 1200,
        height: 630,
        alt: "Wyntech — Web Design, Software & Automation",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-wyntech.jpg"],
  },
}

export default async function WynTechPage() {
  const data =
    await getCompanyPageData(
      "wyntech",
    )

  if (!data) {
    notFound()
  }

  const {
    company,
    services,
    portfolio,
    testimonials,
    faqs,
  } = data

  return (
    <>
      <CompanyNavbar
        company={company}
      />

      <main
        id="main-content"
        className="min-h-screen"
      >
        {/* Promise */}
        <CompanyHero
          company={company}
        />

        {/* What can I hire you for? */}
        <CompanyServices
          company={company}
          services={services}
        />

        {/* Show me that you can do it */}
        <CompanyPortfolio
          company={company}
          portfolio={portfolio}
        />

        {/* What did other people think? */}
        {testimonials.length >
          0 && (
          <CompanyTestimonials
            company={company}
            testimonials={
              testimonials
            }
          />
        )}

        {/* Who am I actually hiring? */}
        <CompanyAbout
          company={company}
        />

        {/* Make the next action obvious */}
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

        {/* Lower-intent questions + inquiry */}
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
