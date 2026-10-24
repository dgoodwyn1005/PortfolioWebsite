import type { Metadata } from "next"

import {
  ArrowDown,
} from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

import { PhotoGalleryClient } from "@/components/photo-gallery-client"

import {
  getLifePageData,
} from "@/lib/content/worlds"

export const metadata: Metadata = {
  title: "Life",

  description:
    "Athletics, education, experiences, milestones, and the evolving life of Deshawn Goodwyn.",

  alternates: {
    canonical: "/life",
  },
}

export default async function LifePage() {
  const {
    navigation,
    photos,
    stats,
  } = await getLifePageData()

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
                  03 / Life
                </p>
              </div>

              <div className="lg:col-span-8">
                <h1 className="max-w-5xl text-[clamp(4rem,12vw,10rem)] font-medium leading-[0.8] tracking-[-0.07em]">
                  Still
                  <br />
                  becoming.
                </h1>
              </div>
            </div>

            <div className="grid gap-8 border-t border-border/70 pt-6 lg:grid-cols-12">
              <ArrowDown className="size-5 text-muted-foreground lg:col-span-4" />

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-8">
                Athletics, education,
                people, places,
                milestones, and the
                experiences that don&apos;t
                fit neatly into a
                professional title.
              </p>
            </div>
          </div>
        </section>

        {/* Real life stats */}
        {stats.length > 0 && (
          <section className="border-b border-border/60 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Along the way
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
                    Some things leave
                    numbers behind.
                  </h2>
                </div>
              </div>

              <div className="mt-12 grid border-t border-border/70 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
                {stats.map(
                  (
                    stat,
                    index,
                  ) => (
                    <div
                      key={stat.id}
                      className={[
                        "border-b border-border/70 py-7",

                        "sm:px-6 sm:py-9",

                        index > 0
                          ? "sm:border-l"
                          : "sm:pl-0",
                      ].join(" ")}
                    >
                      <p className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* Current season */}
        <section className="border-b border-border/60 py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Right Now
                </p>
              </div>

              <div className="lg:col-span-8">
                <h2 className="max-w-4xl text-4xl font-medium leading-[1] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  The current season,
                  before it becomes
                  history.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Life keeps moving
                  while the work,
                  competition, music,
                  relationships, and
                  learning overlap.
                  This page is meant to
                  preserve that motion
                  rather than force it
                  into separate eras.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Life photography */}
        {photos.length > 0 && (
          <section className="border-b border-border/60 py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Selected Moments
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                    A life looks
                    different from
                    inside it.
                  </h2>
                </div>
              </div>

              <div className="mt-12 lg:mt-16">
                <PhotoGalleryClient
                  photos={photos}
                />
              </div>
            </div>
          </section>
        )}

        {/* Archive teaser — honest about current state */}
        <section className="py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Archive
                </p>
              </div>

              <div className="lg:col-span-8">
                <p className="max-w-3xl text-2xl font-medium leading-relaxed tracking-[-0.03em] sm:text-3xl">
                  Eventually, this
                  becomes a record of
                  years—not just
                  highlights.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}