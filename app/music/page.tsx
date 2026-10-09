import type { Metadata } from "next"

import Link from "next/link"

import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { AudioSamples } from "@/components/company/audio-samples"
import { MusicSection } from "@/components/company/music-section"
import { VideoShowcase } from "@/components/sections/video-showcase"

import {
  getMusicPageData,
} from "@/lib/content/worlds"

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
        <section className="min-h-[90svh] border-b border-border/60">
          <div className="mx-auto flex min-h-[90svh] max-w-7xl flex-col justify-between px-4 pb-10 pt-32 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16 lg:pt-40">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                02 / Music
              </p>

              <h1 className="mt-8 max-w-6xl text-[clamp(4rem,12vw,10rem)] font-medium leading-[0.8] tracking-[-0.07em]">
                At the
                <br />
                piano.
              </h1>
            </div>

            <div className="grid gap-8 border-t border-border/70 pt-6 lg:grid-cols-12">
              <ArrowDown className="size-5 text-muted-foreground lg:col-span-4" />

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-8">
                Performance,
                arranging, listening,
                learning, and the
                moments that happen
                around the instrument.
              </p>
            </div>
          </div>
        </section>

        {/* Real recordings */}
        {audioSamples.length > 0 && (
          <AudioSamples
            samples={audioSamples}
          />
        )}

        {/* Personal / atmospheric statement */}
        <section className="border-b border-border/60 py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              The Music Room
            </p>

            <p className="mt-10 max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Music has always been
              less about fitting into
              one genre and more about
              learning how to listen,
              respond, and make
              something meaningful in
              the moment.
            </p>
          </div>
        </section>

        {/* Real music videos */}
        {videos.length > 0 && (
          <VideoShowcase
            videos={videos}
          />
        )}

        {/* Real Wynora data */}
        {wynora && (
          <section className="border-b border-border/60 py-20 sm:py-28 lg:py-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/wynora"
                className="group grid gap-8 lg:grid-cols-12"
              >
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Wynora
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex items-start justify-between gap-8">
                    <div>
                      <h2 className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                        {
                          wynora
                            .company
                            .name
                        }
                      </h2>

                      {wynora
                        .company
                        .tagline && (
                        <p className="mt-4 text-lg text-foreground">
                          {
                            wynora
                              .company
                              .tagline
                          }
                        </p>
                      )}

                      {wynora
                        .company
                        .description && (
                        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                          {
                            wynora
                              .company
                              .description
                          }
                        </p>
                      )}
                    </div>

                    <ArrowUpRight className="mt-2 size-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Deeper real audio */}
        {audioClips.length > 0 && (
          <MusicSection
            clips={audioClips}
            companyName={
              wynora?.company
                .name ?? "Wynora"
            }
          />
        )}

        <section className="py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/wynora"
              className="group flex items-end justify-between gap-8 border-t border-border/70 pt-8"
            >
              <h2 className="max-w-4xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Put some music in the
                room.
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