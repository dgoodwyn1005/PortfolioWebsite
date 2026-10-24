"use client"

import {
  motion,
} from "framer-motion"

import {
  Mail,
  Phone,
} from "lucide-react"

import {
  ContactForm,
} from "@/components/contact-form"
import {
  SchedulingButton,
} from "@/components/scheduling-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

export function CompanyContact({
  company,
  faqs,
}: {
  company: Company
  faqs: FAQ[]
}) {
  const schedulingUrl =
    company.scheduling_url ||
    company.calendly_url

  const isWynora =
    company.slug === "wynora"

  const heading = isWynora
    ? "Request a Booking"
    : "Start a Project"

  const description = isWynora
    ? "Tell me what you need and I’ll review the event, timing, and service before following up."
    : "Tell me what you want to build. A short description is enough to start."

  return (
    <section
      id="contact"
      className="bg-muted/30 py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            {heading}
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground">
            {description}
          </p>

          {schedulingUrl && (
            <div className="mt-6">
              <SchedulingButton
                url={schedulingUrl}
                buttonText={
                  isWynora
                    ? "Schedule a Conversation"
                    : "Schedule a Consultation"
                }
              />
            </div>
          )}
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="rounded-2xl border border-border bg-card p-6 sm:p-8"
          >
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              {isWynora
                ? "Tell me about the booking"
                : "Tell me about the project"}
            </h3>

            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
              I only need the essentials
              for the first message. We
              can work through the
              details after I review it.
            </p>

            <ContactForm
              companySlug={
                company.slug
              }
              submissionType="quote"
              buttonText={
                isWynora
                  ? "Request Booking"
                  : "Request Quote"
              }
              mode={
                isWynora
                  ? "music"
                  : "build"
              }
            />

            <div className="mt-8 space-y-4 border-t border-border pt-8">
              {company.contact_email && (
                <a
                  href={`mailto:${company.contact_email}`}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail
                    className="h-5 w-5"
                    style={{
                      color:
                        company.primary_color,
                    }}
                  />

                  {
                    company.contact_email
                  }
                </a>
              )}

              {company.contact_phone && (
                <a
                  href={`tel:${company.contact_phone}`}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone
                    className="h-5 w-5"
                    style={{
                      color:
                        company.primary_color,
                    }}
                  />

                  {
                    company.contact_phone
                  }
                </a>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <h3 className="mb-6 text-xl font-semibold text-foreground">
              Frequently Asked
              Questions
            </h3>

            {faqs.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                className="space-y-4"
              >
                {faqs.map(
                  (faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="rounded-xl border border-border px-4"
                    >
                      <AccordionTrigger className="text-left">
                        {
                          faq.question
                        }
                      </AccordionTrigger>

                      <AccordionContent className="text-muted-foreground">
                        {
                          faq.answer
                        }
                      </AccordionContent>
                    </AccordionItem>
                  ),
                )}
              </Accordion>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-8">
                <p className="text-muted-foreground">
                  Have a question that
                  is not covered here?
                  Send it with your
                  inquiry and I’ll
                  address it when I
                  follow up.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
