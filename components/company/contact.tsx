"use client"

import { motion } from "framer-motion"
import { Mail, Phone } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { SchedulingButton } from "@/components/scheduling-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Company {
  name: string
  slug: string
  contact_email: string
  contact_phone: string
  primary_color: string
  calendly_url?: string
  scheduling_url?: string
}

export function CompanyContact({ company, faqs }: { company: Company; faqs: FAQ[] }) {
  const schedulingUrl = company.scheduling_url || company.calendly_url

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to start your project? Let's talk about how we can help.
          </p>
          {schedulingUrl && (
            <div className="mt-6">
              <SchedulingButton url={schedulingUrl} buttonText="Schedule a Consultation" />
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <h3 className="text-xl font-semibold text-foreground mb-6">Send us a message</h3>
            <ContactForm 
              companySlug={company.slug} 
              submissionType="quote" 
              buttonText={company.slug === "wynora" ? "Request Booking" : "Request Quote"}
              showOnboarding={company.slug === "wyntech"}
              showWynoraOnboarding={company.slug === "wynora"}
            />

            <div className="mt-8 pt-8 border-t border-border space-y-4">
              {company.contact_email && (
                <a
                  href={`mailto:${company.contact_email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-5 w-5" style={{ color: company.primary_color }} />
                  {company.contact_email}
                </a>
              )}
              {company.contact_phone && (
                <a
                  href={`tel:${company.contact_phone}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-5 w-5" style={{ color: company.primary_color }} />
                  {company.contact_phone}
                </a>
              )}
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h3>
            {faqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-xl px-4">
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <p className="text-muted-foreground">
                  Have questions? Reach out to us directly and we'll be happy to help!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
