"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"

import { motion } from "framer-motion"
import { ArrowUpRight, FileText } from "lucide-react"

import type {
  QuickStat,
} from "@/lib/content/site"

interface AboutContentProps {
  profileImage: string | null
  aboutParagraph1: string | null
  aboutParagraph2: string | null
  aboutParagraph3: string | null
  resumeUrl: string | null
  stats: QuickStat[]
}

const fallbackIntro =
  "Technology, music, athletics, and curiosity have never felt like separate lanes to me. They are different expressions of the same drive to build, perform, compete, and keep growing."

export function AboutContent({
  profileImage,
  aboutParagraph1,
  aboutParagraph2,
  aboutParagraph3,
  resumeUrl,
  stats,
}: AboutContentProps) {
  const shouldReduceMotion = useReducedMotion()

  /*
   * Homepage = curation, not completeness.
   *
   * For now we use the first three stats returned by the database.
   * Later, we'll give quick_stats an explicit "featured" field so
   * homepage selection is controlled from the CMS.
   */

  const paragraphs = [
    aboutParagraph1,
    aboutParagraph2,
    aboutParagraph3,
  ].filter(Boolean) as string[]

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-20 border-t border-border/60 py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section identity */}
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 16 }
          }
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 sm:mb-14 lg:mb-20"
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            02 / Story
          </p>
        </motion.div>

        {/* Main editorial composition */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Photography */}
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 24 }
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
              duration: shouldReduceMotion ? 0 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5"
          >
            {profileImage ? (
              <div className="relative overflow-hidden bg-muted">
                <div className="aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
                  <img
                    src={profileImage}
                    alt="Deshawn Goodwyn"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none"
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="aspect-[4/5] bg-muted"
              />
            )}
          </motion.div>

          {/* Story */}
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 24 }
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
              duration: shouldReduceMotion ? 0 : 0.7,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-between lg:col-span-7 lg:pl-6"
          >
            <div>
              <h2
                id="about-heading"
                className="max-w-3xl text-4xl font-medium leading-[0.95] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl"
              >
                There has never really been one lane.
              </h2>

              <div className="mt-8 max-w-2xl space-y-5 sm:mt-10">
                {paragraphs.length > 0 ? (
                  paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className={
                        index === 0
                          ? "text-lg leading-relaxed text-foreground sm:text-xl"
                          : "text-base leading-relaxed text-muted-foreground sm:text-lg"
                      }
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-lg leading-relaxed text-foreground sm:text-xl">
                    {fallbackIntro}
                  </p>
                )}
              </div>
            </div>

            {resumeUrl && (
              <div className="mt-8 sm:mt-10">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-3 border-b border-foreground/30 pb-1 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                >
                  <FileText className="size-4" />

                  View portfolio / résumé

                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            )}
          </motion.div>
        </div>

        {/* Selected proof points */}
        {stats.length > 0 && (
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 20 }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              delay: shouldReduceMotion ? 0 : 0.08,
            }}
            className="mt-14 grid border-t border-border/70 sm:mt-20 sm:grid-cols-3 lg:mt-24"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={[
                  "border-b border-border/70 py-6",
                  "sm:border-b-0 sm:px-6 sm:py-8",
                  index > 0
                    ? "sm:border-l sm:border-border/70"
                    : "sm:pl-0",
                ].join(" ")}
              >
                <p className="text-4xl font-medium tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}