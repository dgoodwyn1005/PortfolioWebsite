"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"

import Link from "next/link"

import {
  motion,
} from "framer-motion"

import type { LucideIcon } from "lucide-react"

import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react"

import { ContactForm } from "@/components/contact-form"
import { SchedulingButton } from "@/components/scheduling-button"

import type {
  SocialLink,
} from "@/lib/content/site"

const iconMap: Record<
  string,
  LucideIcon
> = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Youtube,
}

interface ContactContentProps {
  settings: Record<string, string>
  socialLinks: SocialLink[]
}

const paths = [
  {
    number: "01",
    title: "Build something",
    description:
      "Websites, products, software, and technology work.",
    href: "/wyntech",
  },
  {
    number: "02",
    title: "Music & performance",
    description:
      "Piano, performance, arranging, and music opportunities.",
    href: "/wynora",
  },
  {
    number: "03",
    title: "Hire or collaborate",
    description:
      "Recruiting, partnerships, creative work, speaking, or something else.",
    href: "#contact-form",
  },
]

export function ContactContent({
  settings,
  socialLinks,
}: ContactContentProps) {
  const shouldReduceMotion =
    useReducedMotion()

  const schedulingUrl =
    settings.scheduling_url ||
    settings.calendly_url

  const schedulingButtonText =
    settings.scheduling_button_text ||
    "Schedule a Call"

  const heading =
    settings.contact_heading ||
    "Start with why you're here."

  const description =
    settings.contact_description ||
    "Different work calls for different conversations. Choose the direction that fits, or send me a message directly."

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 border-t border-border/60 py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 20,
                }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration:
              shouldReduceMotion
                ? 0
                : 0.6,
          }}
        >
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                05 / Work With Me
              </p>
            </div>

            <div className="lg:col-span-8">
              <h2
                id="contact-heading"
                className="max-w-3xl text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl"
              >
                {heading}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
          </div>

          {/* Intent routing */}
          <div className="mt-12 grid border-t border-border/70 sm:mt-16 lg:grid-cols-3">
            {paths.map((path) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs text-muted-foreground">
                      {path.number}
                    </span>

                    {path.href.startsWith(
                      "#",
                    ) ? (
                      <ArrowDown className="size-4 text-muted-foreground transition-transform group-hover:translate-y-1" />
                    ) : (
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    )}
                  </div>

                  <div className="mt-10">
                    <h3 className="text-2xl font-medium tracking-tight text-foreground">
                      {path.title}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {path.description}
                    </p>
                  </div>
                </>
              )

              return path.href.startsWith(
                "#",
              ) ? (
                <a
                  key={path.number}
                  href={path.href}
                  className="group min-h-48 border-b border-border/70 py-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={path.number}
                  href={path.href}
                  className="group min-h-48 border-b border-border/70 py-6 lg:border-b-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0"
                >
                  {content}
                </Link>
              )
            })}
          </div>

          {/* Direct contact */}
          <div
            id="contact-form"
            className="scroll-mt-24 border-t border-border/70 pt-12 sm:pt-16 lg:pt-20"
          >
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <h3 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  Send a message.
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
                  For opportunities,
                  questions, collaborations,
                  or anything that doesn&apos;t
                  fit neatly into a category.
                </p>

                {schedulingUrl && (
                  <div className="mt-6">
                    <SchedulingButton
                      url={schedulingUrl}
                      buttonText={
                        schedulingButtonText
                      }
                    />
                  </div>
                )}

                {socialLinks.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-1">
                    {socialLinks.map(
                      (link) => {
                        const Icon =
                          iconMap[
                            link.icon
                          ] || Mail

                        return (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={
                              link.name
                            }
                            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                          >
                            <Icon className="size-5" />
                          </a>
                        )
                      },
                    )}
                  </div>
                )}
              </div>

              <div className="lg:col-span-8">
                <ContactForm
                  submissionType="contact"
                  buttonText="Send Message"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}