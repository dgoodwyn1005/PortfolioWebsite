"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"

import Link from "next/link"

import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react"

import {
  motion,
} from "framer-motion"

const worlds = [
  {
    number: "01",
    name: "Build",
    description:
      "Technology, products, ventures, and the ideas behind them.",
    href: "/build",
  },
  {
    number: "02",
    name: "Music",
    description:
      "Piano, performance, arranging, and musical creation.",
    href: "/music",
  },
  {
    number: "03",
    name: "Life",
    description:
      "Athletics, education, experiences, and the story in between.",
    href: "/life",
  },
]

interface HeroSectionProps {
  backgroundImage?: string | null
  description?: string | null
}

export function HeroSection({
  backgroundImage = null,
  description =
    "I build digital products, make music, compete, and document the work and life connecting it all.",
}: HeroSectionProps) {
  const shouldReduceMotion =
    useReducedMotion()

  const transition = {
    duration:
      shouldReduceMotion
        ? 0
        : 0.8,

    ease: [
      0.22,
      1,
      0.36,
      1,
    ] as const,
  }

  return (
    <section
      aria-labelledby="home-heading"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
      >
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover object-center opacity-30"
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/80 to-background"
      />

      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-8 pt-28 sm:px-6 sm:pb-10 sm:pt-32 lg:px-8 lg:pb-12">
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <motion.p
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 16,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={
                transition
              }
              className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-sm"
            >
              Build · Music · Life
            </motion.p>

            <motion.h1
              id="home-heading"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ...transition,

                delay:
                  shouldReduceMotion
                    ? 0
                    : 0.08,
              }}
              className="max-w-6xl text-[clamp(3.6rem,15vw,9.5rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-foreground"
            >
              <span className="block">
                Deshawn
              </span>

              <span className="block">
                Goodwyn
              </span>
            </motion.h1>

            <motion.div
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 18,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ...transition,

                delay:
                  shouldReduceMotion
                    ? 0
                    : 0.18,
              }}
              className="mt-8 max-w-2xl sm:mt-10"
            >
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                {description}
              </p>

              <Link
                href="/#projects"
                className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground"
              >
                Selected work

                <ArrowDown className="size-4 transition-transform group-hover:translate-y-1" />
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 24,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            ...transition,

            delay:
              shouldReduceMotion
                ? 0
                : 0.35,
          }}
          className="mt-12 grid border-t border-border/70 md:grid-cols-3"
        >
          {worlds.map(
            (world) => (
              <Link
                key={world.name}
                href={world.href}
                className={[
                  "group relative flex min-h-36 flex-col justify-between",
                  "border-b border-border/70 py-5",
                  "transition-colors hover:bg-foreground/[0.03]",
                  "md:min-h-44 md:border-b-0 md:px-6 md:py-6",
                  "md:first:pl-0",
                  "md:not-first:border-l md:not-first:border-border/70",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    {
                      world.number
                    }
                  </span>

                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                    {world.name}
                  </h2>

                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {
                      world.description
                    }
                  </p>
                </div>
              </Link>
            ),
          )}
        </motion.div>
      </div>
    </section>
  )
}
