import type {
  Metadata,
} from "next"

import Link from "next/link"

import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react"

import {
  Footer,
} from "@/components/footer"
import {
  Navbar,
} from "@/components/navbar"
import {
  ProjectCard,
} from "@/components/project-card"

import {
  getBuildPageData,
} from "@/lib/content/worlds"

import styles from "@/styles/worlds.module.css"

export const metadata: Metadata = {
  title: "Build",

  description:
    "Products, technology, ventures, and experiments built by Deshawn Goodwyn.",

  alternates: {
    canonical: "/build",
  },
}

const processSteps = [
  "Understand",
  "Reduce",
  "Build",
  "Test",
  "Refine",
  "Ship",
]

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
        <section
          className={`${styles.buildGrid} min-h-[88svh] border-b border-border/60`}
        >
          <div className="mx-auto flex min-h-[88svh] max-w-7xl flex-col justify-between px-4 pb-10 pt-32 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16 lg:pt-40">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  01 / Build
                </p>

                <div className="mt-8 hidden max-w-[15rem] border-t border-border/70 pt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground lg:block">
                  <p>Products</p>
                  <p>Software</p>
                  <p>Systems</p>
                  <p>Ventures</p>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border/70 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                  <span>System index</span>
                  <span aria-hidden="true">/</span>
                  <span>Ideas → useful things</span>
                </div>

                <h1 className="mt-8 max-w-5xl text-[clamp(3.75rem,10vw,9rem)] font-medium leading-[0.82] tracking-[-0.07em] text-foreground">
                  Things made
                  <br />
                  to be used.
                </h1>

                <div className="mt-12 grid overflow-hidden border border-border/70 bg-border/70 sm:grid-cols-3">
                  {[
                    [
                      "01",
                      "Products",
                      "Useful software with a reason to exist.",
                    ],
                    [
                      "02",
                      "Experiments",
                      "Ideas tested quickly enough to teach something.",
                    ],
                    [
                      "03",
                      "Ventures",
                      "Systems designed to keep working beyond the first launch.",
                    ],
                  ].map(
                    ([number, title, copy]) => (
                      <div
                        key={number}
                        className={`${styles.buildPanel} min-h-36 p-5 sm:min-h-44`}
                      >
                        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                          {number}
                        </p>
                        <p className="mt-8 text-sm font-medium uppercase tracking-[0.16em]">
                          {title}
                        </p>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                          {copy}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-8 border-t border-border/70 pt-6 lg:grid-cols-12">
              <ArrowDown className="size-5 text-muted-foreground lg:col-span-4" />

              <div className="lg:col-span-8 lg:flex lg:items-end lg:justify-between lg:gap-10">
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Products, software,
                  ventures, and
                  experiments. This is
                  where ideas become
                  systems people can
                  actually use.
                </p>

                <p className="mt-5 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:mt-0">
                  Scroll / inspect
                </p>
              </div>
            </div>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="border-b border-border/60 bg-muted/15 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="border-t border-border/70 pt-4">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      Selected Work
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(projects.length).padStart(2, "0")} entries
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                    Products,
                    experiments, and
                    things shipped.
                  </h2>

                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    A working index of
                    what has moved from
                    thought to something
                    testable, usable, or
                    public.
                  </p>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 border-t border-border/70 pt-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-y-20 lg:pt-12">
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

        {wyntech && (
          <section className="border-b border-border/60 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Commercial Layer
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Venture / 01
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <Link
                    href="/wyntech"
                    className="group block overflow-hidden border border-border/70 bg-card transition-colors hover:bg-muted/40"
                  >
                    <div className="grid sm:grid-cols-[minmax(0,1fr)_auto]">
                      <div className="p-6 sm:p-8 lg:p-10">
                        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          <span>Services</span>
                          <span aria-hidden="true">/</span>
                          <span>Client work</span>
                        </div>

                        <h2 className="mt-8 text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
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

                        <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                          Websites,
                          software, and
                          automation for
                          people who want
                          to turn an idea
                          into something
                          useful.
                        </p>

                        <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                          View Wyntech
                          services
                          <ArrowUpRight className="size-4" />
                        </span>
                      </div>

                      <div className="flex min-h-24 items-center justify-center border-t border-border/70 p-6 sm:w-28 sm:border-l sm:border-t-0">
                        <ArrowUpRight className="size-7 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

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
                  A repeatable system,
                  not a ritual.
                </p>

                <div className="mt-10 grid overflow-hidden border border-border/70 bg-border/70 sm:grid-cols-2 lg:grid-cols-3">
                  {processSteps.map(
                    (step, index) => (
                      <div
                        key={step}
                        className="min-h-32 bg-background p-5"
                      >
                        <p className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-8 text-lg font-medium tracking-[-0.02em]">
                          {step}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/wyntech#services"
              className="group grid gap-8 border-y border-border/70 py-8 transition-colors hover:bg-muted/30 sm:py-10 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Work with me through
                  Wyntech
                </p>
              </div>

              <div className="flex items-end justify-between gap-8 lg:col-span-8">
                <div>
                  <h2 className="max-w-4xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                    Have something worth
                    building?
                  </h2>

                  <p className="mt-5 text-sm font-medium text-muted-foreground">
                    View services and
                    start a project.
                  </p>
                </div>

                <ArrowUpRight className="mb-2 size-7 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
