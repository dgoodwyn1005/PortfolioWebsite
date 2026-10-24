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

import styles from "@/styles/worlds.module.css"

export const metadata: Metadata = {
  title: "Life",

  description:
    "Athletics, education, experiences, milestones, and the evolving life of Deshawn Goodwyn.",

  alternates: {
    canonical: "/life",
  },
}

const statTilts = [
  "sm:-rotate-1",
  "sm:translate-y-5 sm:rotate-1",
  "sm:-translate-y-2 sm:rotate-[-0.5deg]",
]

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
        <section
          className={`${styles.lifeCanvas} min-h-[95svh] border-b border-border/50`}
        >
          <div className="mx-auto flex min-h-[95svh] max-w-7xl flex-col px-4 pb-10 pt-32 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16 lg:pt-40">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                03 / Life
              </p>

              <div className="rotate-2 rounded-full border border-border/60 bg-background/55 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur sm:text-xs">
                In progress
              </div>
            </div>

            <div className="flex flex-1 items-center py-14 sm:py-20">
              <div className="w-full">
                <div className="grid items-end gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    <p className="mb-5 ml-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground sm:ml-8">
                      No finished version
                    </p>

                    <h1 className="text-[clamp(5rem,15vw,12rem)] font-medium leading-[0.72] tracking-[-0.085em]">
                      Still
                    </h1>

                    <h1 className="ml-[8vw] mt-3 text-[clamp(4.75rem,14vw,11rem)] font-medium leading-[0.76] tracking-[-0.08em] sm:ml-[12vw] lg:ml-32">
                      becoming.
                    </h1>
                  </div>

                  <div className="lg:col-span-4 lg:pb-4">
                    <div
                      className={`${styles.lifePaper} rotate-1 rounded-[1.75rem] border border-border/50 p-6 sm:p-7`}
                    >
                      <p className="text-sm font-medium leading-relaxed sm:text-base">
                        Athletics,
                        education, music,
                        people, places,
                        milestones, and
                        everything that
                        refuses to fit one
                        title.
                      </p>

                      <p className="mt-6 text-xs uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                        A living archive,
                        not a résumé.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 border-t border-border/50 pt-6 lg:grid-cols-12">
              <ArrowDown className="size-5 text-muted-foreground lg:col-span-4" />

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:col-span-8">
                The point is not to make
                every year look neat.
                It is to keep enough of
                the motion that the
                story still feels alive
                later.
              </p>
            </div>
          </div>
        </section>

        {stats.length > 0 && (
          <section className="border-b border-border/50 py-20 sm:py-28 lg:py-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Along the way
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                    Some things leave
                    numbers behind.
                  </h2>

                  <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
                    They are markers,
                    not the whole story.
                    Useful because they
                    make a few moments
                    impossible to forget.
                  </p>
                </div>
              </div>

              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-7">
                {stats.map(
                  (
                    stat,
                    index,
                  ) => (
                    <div
                      key={stat.id}
                      className={`${styles.lifePaper} ${statTilts[index % statTilts.length]} min-h-52 rounded-[1.75rem] border border-border/50 p-6 sm:min-h-64 sm:p-8`}
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <p className="mt-12 text-5xl font-medium tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                        {stat.value}
                      </p>

                      <p className="mt-3 max-w-[16rem] text-xs font-medium uppercase leading-relaxed tracking-[0.16em] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        <section
          className={`${styles.lifeCanvas} border-b border-border/50 py-20 sm:py-28 lg:py-40`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <div className="inline-block -rotate-2 rounded-full border border-border/50 bg-background/60 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
                  Right now
                </div>
              </div>

              <div className="lg:col-span-9">
                <div
                  className={`${styles.lifePaper} rounded-[2rem] border border-border/50 p-6 sm:p-10 lg:p-14`}
                >
                  <h2 className="max-w-4xl text-4xl font-medium leading-[0.96] tracking-[-0.055em] sm:text-5xl lg:text-7xl">
                    The current season,
                    before it becomes
                    history.
                  </h2>

                  <div className="mt-10 grid gap-8 border-t border-border/50 pt-8 sm:grid-cols-2">
                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                      Life keeps moving
                      while the work,
                      competition, music,
                      relationships, and
                      learning overlap.
                    </p>

                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                      This page preserves
                      some of that motion
                      without pretending
                      every part belongs
                      in a clean category.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {photos.length > 0 && (
          <section className="border-b border-border/50 py-20 sm:py-28 lg:py-36">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-end gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="inline-block rotate-[-2deg] rounded-full border border-border/50 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Selected moments
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <h2 className="max-w-4xl text-4xl font-medium leading-[1] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                    A life looks
                    different from
                    inside it.
                  </h2>
                </div>
              </div>

              <div
                className={`${styles.lifePhotoFrame} relative mt-14 overflow-hidden rounded-[2rem] border border-border/50 p-3 sm:p-5 lg:mt-20 lg:p-7`}
              >
                <div className="pointer-events-none absolute right-5 top-5 z-10 hidden rotate-3 rounded-full border border-border/40 bg-background/70 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur sm:block">
                  Open a frame
                </div>

                <PhotoGalleryClient
                  photos={photos}
                  variant="life"
                />
              </div>
            </div>
          </section>
        )}

        <section className="py-24 sm:py-32 lg:py-44">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Archive
                </p>
              </div>

              <div className="lg:col-span-9">
                <p className="max-w-5xl text-[clamp(2.75rem,7vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.06em]">
                  Eventually, this
                  becomes a record of
                  years—not just
                  highlights.
                </p>

                <div className="mt-10 flex flex-wrap gap-2">
                  {[
                    "People",
                    "Places",
                    "Seasons",
                    "Milestones",
                    "Ordinary days",
                  ].map((item, index) => (
                    <span
                      key={item}
                      className={`rounded-full border border-border/60 px-4 py-2 text-xs font-medium text-muted-foreground ${
                        index % 2 === 0
                          ? "rotate-[-1deg]"
                          : "rotate-1"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
