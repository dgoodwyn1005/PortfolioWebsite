import type { Metadata } from "next"

import Link from "next/link"

import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Music2,
  Piano,
  Mic2,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { AudioSamples } from "@/components/company/audio-samples"
import { MusicSection } from "@/components/company/music-section"
import { VideoShowcase } from "@/components/sections/video-showcase"

import {
  getMusicPageData,
} from "@/lib/content/worlds"

import { ResilientImage } from "@/components/resilient-image"

import styles from "@/styles/worlds.module.css"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Music",

  description:
    "Piano, performance, arrangements, recordings, and musical work by Deshawn Goodwyn.",

  alternates: {
    canonical: "/music",
  },
}

export default async function MusicPage() {
  const {
    navigation,
    videos,
    wynora,
    audioSamples,
    audioClips,
  } = await getMusicPageData()

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
          className={`${styles.musicStage} min-h-[92svh] border-b border-border/60`}
        >
          <div className="mx-auto flex min-h-[92svh] max-w-7xl flex-col px-4 pb-10 pt-32 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16 lg:pt-40">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                02 / Music
              </p>

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                Performance · Arrangement · Recording
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-20">
              <p className="mb-7 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                A room for listening
              </p>

              <h1 className="max-w-full text-[clamp(3.5rem,13vw,11rem)] font-medium leading-[0.78] tracking-[-0.075em]">
                At the
                <br />
                piano.
              </h1>

              <p className="mt-9 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Performance,
                arranging, listening,
                learning, and the
                moments that happen
                around the instrument.
              </p>

              <div className="mt-8 flex w-full flex-wrap justify-center gap-3">
                {wynora && <Link href="/wynora#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background">Request a booking <ArrowUpRight className="size-4" aria-hidden="true" /></Link>}
                {videos.length > 0 && <Link href="#videos" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-5 text-sm font-medium">Watch performances <ArrowDown className="size-4" aria-hidden="true" /></Link>}
                {wynora && <Link href="/wynora#services" className="inline-flex min-h-12 items-center px-4 text-sm font-medium underline underline-offset-4">Services & pricing</Link>}
              </div>
            </div>

            <div className="grid gap-8 border-t border-border/60 pt-6 lg:grid-cols-12">
              <ArrowDown className="size-5 text-muted-foreground lg:col-span-4" />

              <div className="lg:col-span-8 lg:flex lg:items-end lg:justify-between lg:gap-8">
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Start with the sound.
                  The rest of this page
                  is arranged like a
                  small program: hear
                  something, see
                  something, then step
                  closer.
                </p>

                <p className="mt-5 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:mt-0">
                  Program / 01
                </p>
              </div>
            </div>
          </div>
        </section>

        {audioSamples.length > 0 && (
          <div className="border-b border-border/60 bg-muted/10">
            <AudioSamples
              samples={audioSamples}
            />
          </div>
        )}

        <section className="portfolio-reveal border-b border-border/60 py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className={`${styles.musicCard} mx-auto max-w-5xl rounded-[2rem] border border-border/60 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20`}
            >
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  The Music Room
                </p>

                <div
                  aria-hidden="true"
                  className={`${styles.musicRule} mx-auto mt-6 h-px w-28`}
                />

                <p className="mt-10 text-3xl font-medium leading-[1.12] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                  Music has always been
                  less about fitting into
                  one genre and more about
                  learning how to listen,
                  respond, and make
                  something meaningful in
                  the moment.
                </p>

                <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Some of it is prepared.
                  Some of it is learned in
                  real time. The point is
                  to make the room feel
                  different after the first
                  note.
                </p>
              </div>
            </div>
          </div>
        </section>

        {videos.length > 0 && (
          <VideoShowcase
            videos={videos}
            variant="stage"
          />
        )}

        {wynora && (
          <section id="wynora" aria-labelledby="wynora-heading" className="scroll-mt-24 border-b border-border/60 py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-t border-border/70 pt-5">
                <div><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Venture / 02</p><p className="mt-2 text-sm font-medium">Professional music services</p></div>
                <Link href="/wynora" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">Visit Wynora <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              </div>
              <div className="relative isolate overflow-hidden rounded-[1.5rem] border border-[#66503b] bg-[#201810] text-white sm:rounded-[2rem]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(218,170,104,0.18),transparent_60%)]" />
                <div className="grid lg:grid-cols-12">
                  <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:col-span-7 lg:p-12">
                    <div className="flex flex-wrap items-center gap-3">
                      {wynora.company.logo_url && <div className="relative size-14 overflow-hidden rounded-xl border border-white/15 bg-white"><ResilientImage sources={[wynora.company.logo_url]} alt="" fallbackLabel="W" className="object-contain p-2" /></div>}
                      <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#f0d0a0]">Live piano · Events · Sessions</span>
                    </div>
                    <h2 id="wynora-heading" className="mt-7 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl lg:text-7xl">{wynora.company.name}</h2>
                    <p className="mt-4 max-w-xl text-2xl font-medium leading-tight tracking-tight sm:text-3xl">Bring the music into the room.</p>
                    <p className="mt-5 max-w-lg leading-relaxed text-[#e2d2bf]">Live piano for weddings, church services and private events, plus accompaniment, arrangements and recording.</p>
                    {wynora.company.tagline && <p className="mt-3 text-sm text-[#e2d2bf]">{wynora.company.tagline}</p>}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href="/wynora#contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f0d0a0] px-5 py-3 text-sm font-semibold text-[#201810] hover:bg-[#ffe5c4]">Request a booking <ArrowRight className="size-4" aria-hidden="true" /></Link>
                      <Link href="/wynora#services" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-medium hover:bg-white/10">Services & pricing <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
                    </div>
                    <p className="mt-4 text-xs text-[#e2d2bf]">Share your event details to request availability and a quote.</p>
                  </div>
                  <div className="flex min-w-0 flex-col justify-center border-t border-white/10 bg-white/[0.025] p-5 sm:p-8 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-10">
                    {wynora.company.hero_background_image ? (
                      <div className="overflow-hidden rounded-xl border border-white/15 bg-[#130f0b]">
                        <div className="relative aspect-[4/3]"><ResilientImage sources={[wynora.company.hero_background_image]} alt="Wynora music studio preview" sizes="(min-width: 1024px) 460px, 100vw" fallbackTone="music" fallbackLabel="Wynora" className="object-cover" /></div>
                        {videos.length > 0 && <Link href="#videos" className="flex min-h-12 items-center justify-between gap-3 px-4 text-sm font-medium">Hear the performances <ArrowDown className="size-4" aria-hidden="true" /></Link>}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-white/15 bg-[#130f0b]/70 p-5">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-[#f0d0a0]">Ways to work together</p>
                        <div className="mt-5 space-y-3">
                          {[
                            { icon: Piano, title: "Live piano", description: "Weddings, events and worship" },
                            { icon: Music2, title: "Accompaniment & arranging", description: "Music shaped around your needs" },
                            { icon: Mic2, title: "Recording", description: "Sessions and musical collaborations" },
                          ].map(({ icon: Icon, title, description }) => <div key={title} className="flex items-center gap-4 rounded-lg border border-white/10 p-4"><div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#f0d0a0]"><Icon className="size-5" aria-hidden="true" /></div><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-[#e2d2bf]">{description}</p></div></div>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {wynora.services.length > 0 && <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
                  {[...wynora.services].sort((a,b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured))).slice(0,3).map((service,index) => <Link key={service.id} href={`/wynora?service=${encodeURIComponent(service.title)}#contact`} className="group flex min-w-0 flex-col bg-[#2b2016] p-5 hover:bg-[#38291d] sm:p-6">
                    <div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] tracking-widest text-[#f0d0a0]">0{index+1} / SERVICE</span><ArrowUpRight className="size-4 shrink-0 text-[#f0d0a0]" aria-hidden="true" /></div>
                    <h3 className="mt-4 font-medium">{service.title}</h3>
                    {service.description && <p className="mt-2 line-clamp-2 text-sm text-[#e2d2bf]">{service.description}</p>}
                    <span className="mt-auto pt-4 text-xs font-medium text-[#f0d0a0]">Request this service</span>
                  </Link>)}
                </div>}
              </div>
            </div>
          </section>
        )}

        {audioClips.length > 0 && (
          <section className="portfolio-reveal border-b border-border/60 bg-muted/10 py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Deeper Listening
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Program / 03
                </p>
              </div>
            </div>

            <MusicSection
              clips={audioClips}
              companyName={
                wynora?.company
                  .name ?? "Wynora"
              }
            />
          </section>
        )}

        {wynora && <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/wynora#contact"
              className="group block rounded-[2rem] border border-border/60 bg-card px-6 py-10 text-center transition-transform duration-300 hover:-translate-y-1 sm:px-10 sm:py-14 lg:px-16 lg:py-20"
            >
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Request a performance
              </p>

              <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Put some music in the
                room.
              </h2>

              <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                Request a booking
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </div>
        </section>}
      </main>

      <Footer />
    </>
  )
}
