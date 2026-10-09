import type { Metadata } from "next"

import Link from "next/link"

import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"

import {
  getBuildPageData,
} from "@/lib/content/worlds"

export const metadata: Metadata = {
  title: "Build",

  description:
    "Products, technology, ventures, and experiments built by Deshawn Goodwyn.",

  alternates: {
    canonical: "/build",
  },
}

export default async function BuildPage() {
  const {
    navigation,
    projects,
    wyntech,
  } = await getBuildPageData()

  return (
    <>
      <Navbar
        logo={navigation.logo}
        linkedinUrl={
          navigation.linkedinUrl
        }
      />

      <main id="main-content">
        {/* Hero */}
        <section className="min-h-[80svh] border-b border-border/60">
          <div className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-between px-4 pb-10 pt-32 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16 lg:pt-40">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  01 / Build
                </p>
              </div>

              <div className="lg:col-span-8">
                <h1 className="max-w-5xl text-[clamp(3.75rem,10vw,9rem)] font-medium leading-[0.82] tracking-[-0.07em] text-foreground">
                  Things made
                  <br />
                  to be used.
                </h1>
              </div>
            </div>

            <div className="mt-16 grid gap-8 border-t border-border/70 pt-6 lg:grid-cols-12">
              <ArrowDown className="size-5 text-muted-foreground lg:col-span-4" />

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-8">
                Products, software,
                ventures, and
                experiments. This is
                where ideas become
                systems people can
                actually use.
              </p>
            </div>
          </div>
        </section>

        {/* Real projects */}
        {projects.length > 0 && (
          <section className="border-b border-border/60 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Selected Work
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                    Products,
                    experiments, and
                    things shipped.
                  </h2>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-y-20">
                {projects.map(
                  (
                    project,
                    index,
                  ) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* Real Wyntech data */}
        {wyntech && (
          <section className="border-b border-border/60 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Venture
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <Link
                    href="/wyntech"
                    className="group block border-t border-border/70 py-8"
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div>
                        <h2 className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                          {
                            wyntech
                              .company
                              .name
                          }
                        </h2>

                        {wyntech
                          .company
                          .tagline && (
                          <p className="mt-3 text-lg text-foreground">
                            {
                              wyntech
                                .company
                                .tagline
                            }
                          </p>
                        )}

                        {wyntech
                          .company
                          .description && (
                          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                            {
                              wyntech
                                .company
                                .description
                            }
                          </p>
                        )}
                      </div>

                      <ArrowUpRight className="mt-2 size-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Process */}
        <section className="border-b border-border/60 py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Process
                </p>
              </div>

              <div className="lg:col-span-8">
                <p className="max-w-3xl text-2xl leading-relaxed tracking-[-0.03em] sm:text-3xl">
                  Understand the
                  problem. Reduce it to
                  what matters. Build.
                  Test. Refine. Ship.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/#contact"
              className="group flex items-end justify-between gap-8 border-t border-border/70 pt-8"
            >
              <h2 className="max-w-4xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Have something worth
                building?
              </h2>

              <ArrowUpRight className="mb-2 size-7 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}