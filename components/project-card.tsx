"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"
import { ResilientImage } from "@/components/resilient-image"

import {
  motion,
} from "framer-motion"

import {
  ArrowUpRight,
  Github,
} from "lucide-react"

import type {
  Project,
} from "@/lib/content/projects"

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({
  project,
  index,
}: ProjectCardProps) {
  const shouldReduceMotion =
    useReducedMotion()

  const technologies =
    project.tech ?? []

  const isFeatured =
    index === 0

  const number = String(
    index + 1,
  ).padStart(2, "0")

  return (
    <motion.article
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 24,
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

        delay:
          shouldReduceMotion
            ? 0
            : Math.min(
                index * 0.06,
                0.18,
              ),

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={
        isFeatured
          ? "group md:col-span-2 lg:col-span-12"
          : "group lg:col-span-6"
      }
    >
      <div
        className={
          isFeatured
            ? "grid gap-5 lg:grid-cols-12 lg:gap-8"
            : ""
        }
      >
        <div
          className={
            isFeatured
              ? "lg:col-span-8"
              : ""
          }
        >
          <div
            className={[
              "relative overflow-hidden border border-border/60 bg-muted shadow-sm transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-black/5",
              isFeatured
                ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]"
                : "aspect-[4/3]",
            ].join(" ")}
          >
            <ResilientImage
              sources={[project.image_url]}
              alt=""
              loading={
                isFeatured
                  ? "eager"
                  : "lazy"
              }
              fetchPriority={
                isFeatured
                  ? "high"
                  : "auto"
              }
              fallbackTone="build"
              fallbackLabel={project.title}
              fallbackDetail={
                technologies.length > 0
                  ? technologies
                      .slice(0, 3)
                      .join(" · ")
                  : "Project preview"
              }
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-35 transition-opacity duration-500 group-hover:opacity-50"
            />

            <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 border border-white/20 bg-black/30 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm sm:left-4 sm:top-4">
              <span>{number}</span>
              <span className="h-px w-5 bg-white/40" />
              <span>Build</span>
            </div>

            {project.live_url && (
              <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:flex">
                Live
                <ArrowUpRight className="size-3" />
              </div>
            )}
          </div>
        </div>

        <div
          className={[
            "border-t border-border/70 pt-4",
            isFeatured
              ? "lg:col-span-4 lg:flex lg:flex-col lg:justify-between lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              : "mt-4",
          ].join(" ")}
        >
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {number}
              </span>

              <div className="flex items-center gap-1">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${project.title} on GitHub`}
                    className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <Github className="size-4" />
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title}`}
                    className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            </div>

            <h3
              className={[
                "mt-5 font-medium tracking-[-0.04em] text-foreground",
                isFeatured
                  ? "text-3xl sm:text-4xl lg:text-5xl"
                  : "text-2xl sm:text-3xl",
              ].join(" ")}
            >
              {project.title}
            </h3>

            <p
              className={[
                "mt-3 leading-relaxed text-muted-foreground",
                isFeatured
                  ? "text-base sm:text-lg"
                  : "text-sm sm:text-base",
              ].join(" ")}
            >
              {project.description}
            </p>
          </div>

          <div
            className={
              isFeatured
                ? "lg:mt-12"
                : "mt-5"
            }
          >
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies
                  .slice(0, 5)
                  .map((technology) => (
                    <span
                      key={technology}
                      className="border border-border/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
              </div>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground"
              >
                Explore project
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
