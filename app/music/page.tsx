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

import styles from "@/styles/worlds.module.css"

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

              <h1 className="max-w-6xl text-[clamp(4.5rem,13vw,11rem)] font-medium leading-[0.78] tracking-[-0.075em]">
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

              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {[
                  "Listen",
                  "Watch",
                  "Perform",
                  "Arrange",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border/70 bg-background/65 px-4 py-2 text-xs font-medium tracking-[0.08em] shadow-sm backdrop-blur"
                  >
                    {item}
                  </span>
                ))}
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

        <section className="border-b border-border/60 py-20 sm:py-28 lg:py-40">
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
          <section className="border-b border-border/60 py-20 sm:py-28 lg:py-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href="/wynora"
                className={`${styles.musicCard} group block overflow-hidden rounded-[2rem] border border-border/60`}
              >
                <div className="grid gap-0 lg:grid-cols-12">
                  <div className="border-b border-border/60 p-6 sm:p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                      Wynora
                    </p>

                    <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                      Live music
                      <br />
                      Events
                      <br />
                      Sessions
                    </p>
                  </div>

                  <div className="p-6 sm:p-8 lg:col-span-8 lg:p-10">
                    <div className="flex items-start justify-between gap-8">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Bring the music into
                          the room.
                        </p>

                        <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
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
                          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                            {
                              wynora
                                .company
                                .description
                            }
                          </p>
                        )}

                        <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                          View performances
                          and services
                          <ArrowUpRight className="size-4" />
                        </span>
                      </div>

                      <ArrowUpRight className="mt-2 size-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {audioClips.length > 0 && (
          <section className="border-b border-border/60 bg-muted/10 py-8 sm:py-12">
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

        <section className="py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/wynora"
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
                Visit Wynora
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
