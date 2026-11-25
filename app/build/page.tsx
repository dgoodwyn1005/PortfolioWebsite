import type {
  Metadata,
} from "next"

import Link from "next/link"

import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Layers3,
  Code2,
  Workflow,
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

import { SonisphereSpotlight, isSonisphere } from "@/components/sonisphere-spotlight"

import { ResilientImage } from "@/components/resilient-image"

import styles from "@/styles/worlds.module.css"

export const revalidate = 300

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

  const flagship = projects.find(isSonisphere)
  const otherProjects = projects.filter((project) => project.id !== flagship?.id)

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

                <h1 className="mt-8 max-w-5xl text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.82] tracking-[-0.07em] text-foreground">
                  Things made
                  <br />
                  to be used.
                </h1>

                {wyntech && <Link href="/wyntech#contact" className="mr-4 mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background">Start a project <ArrowUpRight className="size-4" aria-hidden="true" /></Link>}
                {flagship && <Link href="#sonisphere" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">Explore Sonisphere <ArrowDown className="size-4" aria-hidden="true" /></Link>}

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
          <section className="portfolio-reveal border-b border-border/60 bg-muted/15 py-16 sm:py-24 lg:py-32">
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
                {flagship && <SonisphereSpotlight project={flagship} detailed />}
                {otherProjects.map(
                  (
                    project,
                    index,
                  ) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={flagship ? index + 1 : index}
                    />
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {wyntech && (
          <section id="wyntech" aria-labelledby="wyntech-heading" className="scroll-mt-24 py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-t border-border/70 pt-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Venture / 01</p>
                  <p className="mt-2 text-sm font-medium">Independent software studio</p>
                </div>
                <Link href="/wyntech" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">
                  Visit the studio <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-slate-700 bg-[#0b1420] text-white sm:rounded-[2rem]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_12%,rgba(56,189,248,0.15),transparent_58%)]" />
                <div className="grid lg:grid-cols-12">
                  <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3">
                      {wyntech.company.logo_url && (
                        <div className="relative size-14 overflow-hidden rounded-xl border border-white/15 bg-white">
                          <ResilientImage sources={[wyntech.company.logo_url]} alt="" fallbackLabel="W" className="object-contain p-2" />
                        </div>
                      )}
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-200">Design · Engineering · Automation</span>
                    </div>
                    <h2 id="wyntech-heading" className="mt-7 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">{wyntech.company.name}</h2>
                    <p className="mt-4 max-w-xl text-2xl font-medium leading-tight tracking-tight sm:text-3xl">Have something worth building?</p>
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                      Websites, software and automation for people who want to turn an idea into something useful.
                    </p>
                    {wyntech.company.tagline && <p className="mt-3 text-sm text-slate-300">{wyntech.company.tagline}</p>}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href="/wyntech#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-sky-100">Start a project <ArrowRight className="size-4" aria-hidden="true" /></Link>
                      <Link href="/wyntech#services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">Explore services <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col justify-center border-t border-white/10 bg-white/[0.025] p-5 sm:p-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-10">
                    {wyntech.portfolio.find(item => item.image_url) ? (() => {
                      const work = wyntech.portfolio.find(item => item.image_url)!
                      return (
                        <Link href="/wyntech#portfolio" className="group block overflow-hidden rounded-xl border border-white/15 bg-slate-950">
                          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-300"><span>Studio / Selected work</span><ArrowUpRight className="size-4" aria-hidden="true" /></div>
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <ResilientImage sources={[work.image_url]} alt={work.title} sizes="(min-width: 1024px) 460px, 100vw" fallbackTone="build" fallbackLabel={work.title} className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                          </div>
                          <div className="p-4"><p className="text-sm font-medium text-white">{work.title}</p><p className="mt-1 text-xs text-slate-300">Explore client work</p></div>
                        </Link>
                      )
                    })() : (
                      <div className="rounded-xl border border-white/15 bg-slate-950/65 p-5 sm:p-6">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-sky-200">Studio capabilities</p>
                        <div className="mt-6 space-y-3">
                          {[
                            { icon: Layers3, title: "Web experiences", description: "Design & development" },
                            { icon: Code2, title: "Custom software", description: "Products & integrations" },
                            { icon: Workflow, title: "Automation", description: "Connected workflows" },
                          ].map(({ icon: Icon, title, description }) => (
                            <div key={title} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-sky-200/20 bg-sky-300/10 text-sky-200"><Icon className="size-5" aria-hidden="true" /></div>
                              <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-slate-300">{description}</p></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {wyntech.services.length > 0 && (
                  <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
                    {[...wyntech.services].sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured))).slice(0, 3).map((service, index) => (
                      <Link key={service.id} href={`/wyntech?service=${encodeURIComponent(service.title)}#contact`} className="group flex min-w-0 flex-col bg-[#101c2b] p-5 transition-colors hover:bg-[#17283b] sm:p-6">
                        <div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] tracking-widest text-sky-200">0{index + 1} / SERVICE</span><ArrowUpRight className="size-4 shrink-0 text-sky-200 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></div>
                        <h3 className="mt-4 text-base font-medium text-white">{service.title}</h3>
                        {service.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">{service.description}</p>}
                        <span className="mt-auto pt-4 text-xs font-medium text-sky-200">Discuss this service</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
