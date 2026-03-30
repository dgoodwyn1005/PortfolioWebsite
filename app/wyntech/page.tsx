import { createClient } from "@/lib/supabase/server"
import { CompanyNavbar } from "@/components/company/navbar"
import { CompanyHero } from "@/components/company/hero"
import { CompanyAbout } from "@/components/company/about"
import { CompanyServices } from "@/components/company/services"
import { CompanyPortfolio } from "@/components/company/portfolio"
import { CompanyTestimonials } from "@/components/company/testimonials"
import { CompanyContact } from "@/components/company/contact"
import { CompanyFooter } from "@/components/company/footer"
import { BookingSection } from "@/components/company/booking-section"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WynTech Solutions | Web Development & Automation",
  description: "Custom website development, automation tools, and software solutions for students and small businesses. Starter websites, portfolio sites, e-commerce, and study automation tools.",
  keywords: ["Web Development", "Website Design", "Custom Software", "Automation Tools", "Portfolio Website", "E-Commerce", "WynTech"],
  openGraph: {
    title: "WynTech Solutions | Web Development & Automation",
    description: "Custom website development, automation tools, and software solutions for students and small businesses.",
    type: "website",
    images: [{ url: "/og-wyntech.jpg", width: 1200, height: 630, alt: "WynTech Solutions" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WynTech Solutions",
    description: "Custom website development, automation tools, and software solutions.",
  },
}

export default async function WynTechPage() {
  const supabase = await createClient()

  const { data: company } = await supabase.from("companies").select("*").eq("slug", "wyntech").single()

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
    .eq("status", "approved")
    .order("display_order")

  const { data: faqs } = await supabase
    .from("company_faqs")
    .select("*")
    .eq("company_id", company.id)
    .eq("is_visible", true)
    .order("display_order")

  return (
    <main className="min-h-screen">
      <CompanyNavbar company={company} />
      <CompanyHero company={company} />
      <CompanyAbout company={company} />
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
