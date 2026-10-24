"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"

import {
  useEffect,
  useRef,
  useState,
} from "react"

import Image from "next/image"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import {
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import type { Photo } from "@/lib/content/media"

interface PhotoGalleryClientProps {
  photos: Photo[]
}

const imageLayouts = [
  {
    wrapper:
      "sm:col-span-2 lg:col-span-7 lg:row-span-2",
    aspect:
      "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[5/6]",
  },
  {
    wrapper:
      "sm:col-span-1 lg:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    wrapper:
      "sm:col-span-1 lg:col-span-5",
    aspect: "aspect-[4/3]",
  },
  {
    wrapper:
      "sm:col-span-1 lg:col-span-6",
    aspect: "aspect-[4/3]",
  },
  {
    wrapper:
      "sm:col-span-1 lg:col-span-6",
    aspect: "aspect-[4/3]",
  },
]

export function PhotoGalleryClient({
  photos,
}: PhotoGalleryClientProps) {
  const shouldReduceMotion = useReducedMotion()

  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null)

  const closeButtonRef =
    useRef<HTMLButtonElement>(null)

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const goToPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return null

      return current === 0
        ? photos.length - 1
        : current - 1
    })
  }

  const goToNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return null

      return current === photos.length - 1
        ? 0
        : current + 1
    })
  }

  useEffect(() => {
    if (selectedIndex === null) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = "hidden"

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeLightbox()
      }

      if (event.key === "ArrowLeft") {
        goToPrevious()
      }

      if (event.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    )

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus()
    })

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      )
    }
  }, [selectedIndex])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {photos.map((photo, index) => {
          const layout =
            imageLayouts[index] ??
            imageLayouts[
              imageLayouts.length - 1
            ]

          return (
            <motion.figure
              key={photo.id}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      y: 20,
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
              className={layout.wrapper}
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedIndex(index)
                }
                aria-label={
                  photo.caption
                    ? `View ${photo.caption}`
                    : `View photo ${
                        index + 1
                      }`
                }
                className="group block w-full text-left"
              >
                <div
                  className={[
                    "relative overflow-hidden bg-muted",
                    layout.aspect,
                  ].join(" ")}
                >
                  <Image
                    src={photo.image_url}
                    alt={
                      photo.caption ||
                      "Deshawn Goodwyn"
                    }
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 42vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
                  />
                </div>
              </button>

              {photo.caption && (
                <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {photo.caption}
                </figcaption>
              )}
            </motion.figure>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0
                  : 0.2,
            }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-3 py-16 sm:px-6"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                closeLightbox()
              }}
              aria-label="Close photo viewer"
              className="absolute right-3 top-3 flex size-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 sm:right-5 sm:top-5"
            >
              <X className="size-6" />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    goToPrevious()
                  }}
                  aria-label="Previous photo"
                  className="absolute bottom-4 left-4 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:bottom-auto sm:left-5 sm:top-1/2 sm:-translate-y-1/2"
                >
                  <ChevronLeft className="size-6" />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    goToNext()
                  }}
                  aria-label="Next photo"
                  className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}

            <motion.div
              key={selectedIndex}
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      opacity: 0,
                      scale: 0.97,
                    }
              }
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration:
                  shouldReduceMotion
                    ? 0
                    : 0.25,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="relative flex max-h-full max-w-6xl flex-col items-center"
            >
              <Image
                src={
                  photos[selectedIndex]
                    .image_url
                }
                alt={
                  photos[selectedIndex]
                    .caption ||
                  "Deshawn Goodwyn"
                }
                width={1600}
                height={1200}
                priority
                className="max-h-[72svh] w-auto max-w-full object-contain"
              />

              {photos[selectedIndex]
                .caption && (
                <p className="mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/70 sm:text-base">
                  {
                    photos[selectedIndex]
                      .caption
                  }
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}