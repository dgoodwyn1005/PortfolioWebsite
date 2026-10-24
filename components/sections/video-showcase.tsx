"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"
import { ResilientImage } from "@/components/resilient-image"

import { useState } from "react"

import {
  motion,
} from "framer-motion"

import {
  ArrowUpRight,
  Play,
} from "lucide-react"

import type {
  Video,
} from "@/lib/content/media"

function timeToSeconds(
  time?: string | null,
): number {
  if (!time) return 0

  const parts = time
    .trim()
    .split(":")
    .map(Number)

  if (parts.length === 3) {
    return (
      parts[0] * 3600 +
      parts[1] * 60 +
      parts[2]
    )
  }

  if (parts.length === 2) {
    return (
      parts[0] * 60 +
      parts[1]
    )
  }

  return Number(parts[0]) || 0
}

function buildYouTubeEmbedUrl(
  videoId: string,
  startTime?: string | null,
  endTime?: string | null,
) {
  const params =
    new URLSearchParams({
      autoplay: "1",
      rel: "0",
    })

  const start =
    timeToSeconds(startTime)

  const end =
    timeToSeconds(endTime)

  if (start > 0) {
    params.set("start", String(start))
  }

  if (end > 0) {
    params.set("end", String(end))
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

function getPlatform(video: Video) {
  return (
    video.platform
      ?.toLowerCase() ??
    "youtube"
  )
}

function getVideoId(video: Video) {
  return video.embed_id
}

function getExternalUrl(video: Video) {
  const platform =
    getPlatform(video)

  const videoId =
    getVideoId(video)

  if (!videoId) return null

  if (platform === "tiktok") {
    const username =
      video.tiktok_username ??
      "TheSilentPianist"

    return `https://www.tiktok.com/@${username}/video/${videoId}`
  }

  if (
    platform === "twitter" ||
    platform === "x"
  ) {
    return `https://x.com/i/status/${videoId}`
  }

  return null
}

function getThumbnailSources(
  video: Video,
) {
  const platform =
    getPlatform(video)

  const videoId =
    getVideoId(video)

  const sources: Array<
    string | null | undefined
  > = [video.thumbnail_url]

  if (
    platform === "youtube" &&
    videoId
  ) {
    sources.push(
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    )
  }

  return sources
}

interface VideoShowcaseProps {
  videos: Video[]
  variant?: "default" | "stage"
}

export function VideoShowcase({
  videos,
  variant = "default",
}: VideoShowcaseProps) {
  const shouldReduceMotion =
    useReducedMotion()

  const [activeVideo, setActiveVideo] =
    useState<string | null>(null)

  if (!videos.length) return null

  const isStage =
    variant === "stage"

  return (
    <section
      id="videos"
      aria-labelledby="videos-heading"
      className={[
        "scroll-mt-20 border-y border-border/60 py-16 sm:py-24 lg:py-32",
        isStage
          ? "bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_34%)]"
          : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={[
            "mb-10 grid gap-6 sm:mb-14 lg:mb-16 lg:grid-cols-12",
            isStage
              ? "items-end"
              : "",
          ].join(" ")}
        >
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {isStage
                ? "Performance / Selected media"
                : "04 / Selected Media"}
            </p>
          </div>

          <div className="lg:col-span-8">
            <h2
              id="videos-heading"
              className={[
                "max-w-3xl font-medium tracking-[-0.05em] text-foreground",
                isStage
                  ? "text-4xl sm:text-5xl lg:text-6xl"
                  : "text-3xl sm:text-4xl lg:text-5xl",
              ].join(" ")}
            >
              {isStage
                ? "A few moments from the room."
                : "Some things are better seen than explained."}
            </h2>

            {isStage && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Not a reel for the sake of a reel—just enough to feel how the music sits in a space.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          {videos.map(
            (video, index) => {
              const platform =
                getPlatform(video)

              const videoId =
                getVideoId(video)

              const externalUrl =
                getExternalUrl(video)

              const isYouTube =
                platform === "youtube"

              const isActive =
                activeVideo === video.id

              const isFeatured =
                index === 0

              return (
                <motion.article
                  key={video.id}
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
                        : index * 0.06,
                  }}
                  className={
                    isFeatured
                      ? "lg:col-span-8"
                      : "lg:col-span-4"
                  }
                >
                  <div
                    className={[
                      "group",
                      isStage
                        ? "rounded-[1.75rem] border border-border/50 bg-card/60 p-3 shadow-lg shadow-black/5 backdrop-blur sm:p-4"
                        : "",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "relative aspect-video overflow-hidden bg-muted",
                        isStage
                          ? "rounded-[1.25rem]"
                          : "",
                      ].join(" ")}
                    >
                      {isYouTube &&
                      isActive &&
                      videoId ? (
                        <iframe
                          src={buildYouTubeEmbedUrl(
                            videoId,
                            video.start_time,
                            video.end_time,
                          )}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 h-full w-full"
                        />
                      ) : externalUrl ? (
                        <a
                          href={externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Watch ${video.title}`}
                          className="absolute inset-0 block"
                        >
                          <VideoThumbnail
                            video={video}
                            featured={
                              isFeatured
                            }
                            warm={isStage}
                          />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (videoId) {
                              setActiveVideo(
                                video.id,
                              )
                            }
                          }}
                          disabled={!videoId}
                          aria-label={`Play ${video.title}`}
                          className="absolute inset-0 h-full w-full text-left disabled:cursor-default"
                        >
                          <VideoThumbnail
                            video={video}
                            featured={
                              isFeatured
                            }
                            warm={isStage}
                          />
                        </button>
                      )}
                    </div>

                    <div
                      className={[
                        "mt-4 flex items-start justify-between gap-5 border-t border-border/70 pt-4",
                        isStage
                          ? "px-1 pb-1"
                          : "",
                      ].join(" ")}
                    >
                      <div>
                        <h3
                          className={
                            isFeatured
                              ? "text-xl font-medium tracking-tight text-foreground sm:text-2xl"
                              : "text-lg font-medium tracking-tight text-foreground"
                          }
                        >
                          {video.title}
                        </h3>

                        {video.section && (
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                            {video.section}
                          </p>
                        )}
                      </div>

                      {externalUrl && (
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            },
          )}
        </div>
      </div>
    </section>
  )
}

function VideoThumbnail({
  video,
  featured,
  warm,
}: {
  video: Video
  featured: boolean
  warm: boolean
}) {
  const platform =
    getPlatform(video)

  return (
    <>
      <ResilientImage
        sources={
          getThumbnailSources(video)
        }
        alt=""
        loading={
          featured
            ? "eager"
            : "lazy"
        }
        fetchPriority={
          featured
            ? "high"
            : "auto"
        }
        fallbackTone={
          warm
            ? "music"
            : "neutral"
        }
        fallbackLabel={video.title}
        fallbackDetail={
          `${platform} preview`
        }
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
      />

      <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:scale-105 sm:size-16">
          {platform === "youtube" ? (
            <Play className="ml-1 size-6 fill-current sm:size-7" />
          ) : (
            <ArrowUpRight className="size-6" />
          )}
        </div>
      </div>

      <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur-sm">
        {platform}
      </div>

      {video.start_time && (
        <span className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
          {video.start_time}
          {video.end_time
            ? ` – ${video.end_time}`
            : ""}
        </span>
      )}
    </>
  )
}
