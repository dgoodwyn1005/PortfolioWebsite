"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Piano, Play, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ResilientImage } from "@/components/resilient-image"

interface Video {
  id: string
  title: string
  platform: "youtube" | "tiktok" | "twitter"
  embed_id: string
  thumbnail?: string | null
  tiktok_username?: string | null
  start_time?: string | null
  end_time?: string | null
}

function timeToSeconds(
  time: string | null | undefined,
): number | null {
  if (!time) return null

  const parts = time
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
    return parts[0] * 60 + parts[1]
  }

  return null
}

function isValidVideoId(video: Video) {
  const placeholderIds = [
    "dQw4w9WgXcQ",
    "7339123456789012345",
    "placeholder",
    "test",
    "example",
  ]

  if (
    placeholderIds.includes(
      video.embed_id,
    )
  ) {
    return false
  }

  return Boolean(
    video.embed_id &&
      video.embed_id.length >= 5,
  )
}

function useTikTokThumbnail(
  videoId: string,
  username: string,
  existingThumbnail?: string | null,
) {
  const [thumbnail, setThumbnail] =
    useState<string | null>(
      existingThumbnail || null,
    )

  useEffect(() => {
    if (existingThumbnail || !videoId) {
      return
    }

    const tiktokUrl =
      `https://www.tiktok.com/@${username}/video/${videoId}`

    const oembedUrl =
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`

    fetch(oembedUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "TikTok oEmbed unavailable",
          )
        }

        return response.json()
      })
      .then((data: { thumbnail_url?: string }) => {
        if (data.thumbnail_url) {
          setThumbnail(
            data.thumbnail_url,
          )
        }
      })
      .catch(() => {
        // The persistent fallback remains visible.
      })
  }, [
    existingThumbnail,
    username,
    videoId,
  ])

  return thumbnail
}

function TikTokVideoCard({
  video,
  externalUrl,
}: {
  video: Video
  externalUrl: string
}) {
  const username =
    video.tiktok_username ||
    "TheSilentPianist"

  const thumbnail =
    useTikTokThumbnail(
      video.embed_id,
      username,
      video.thumbnail,
    )

  return (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/tiktok absolute inset-0 flex h-full w-full flex-col items-center justify-center"
    >
      <ResilientImage
        sources={[
          video.thumbnail,
          thumbnail,
        ]}
        alt={video.title}
        fallbackTone="music"
        fallbackLabel={video.title}
        fallbackDetail="TikTok performance"
        className="object-cover"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25 transition-colors group-hover/tiktok:bg-black/45">
        <div className="flex size-14 items-center justify-center rounded-full border border-white/30 bg-white/95 text-black shadow-xl transition-transform group-hover/tiktok:scale-105">
          <ExternalLink className="size-5" />
        </div>

        <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/90">
          Watch on TikTok
        </span>
      </div>
    </a>
  )
}

interface SilentPianistProps {
  videos: Video[]
  title?: string
  description?: string
}

export function SilentPianist({
  videos,
  title = "The Silent Pianist",
  description = "Watch performances and behind-the-scenes content from The Silent Pianist series",
}: SilentPianistProps) {
  const [activeVideo, setActiveVideo] =
    useState<string | null>(null)

  const validVideos =
    videos.filter(isValidVideoId)

  if (validVideos.length === 0) {
    return null
  }

  function getEmbedUrl(video: Video) {
    const baseUrl =
      `https://www.youtube.com/embed/${video.embed_id}`

    const startSec =
      timeToSeconds(video.start_time)

    const params =
      new URLSearchParams({
        autoplay: "1",
        rel: "0",
      })

    if (
      startSec !== null &&
      startSec > 0
    ) {
      params.set(
        "start",
        startSec.toString(),
      )
    }

    return `${baseUrl}?${params.toString()}`
  }

  function getThumbnailSources(
    video: Video,
  ) {
    if (video.platform !== "youtube") {
      return [video.thumbnail]
    }

    return [
      video.thumbnail,
      `https://img.youtube.com/vi/${video.embed_id}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${video.embed_id}/sddefault.jpg`,
      `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`,
      `https://img.youtube.com/vi/${video.embed_id}/mqdefault.jpg`,
    ]
  }

  function getExternalUrl(video: Video) {
    const tiktokUsername =
      video.tiktok_username ||
      "TheSilentPianist"

    switch (video.platform) {
      case "youtube":
        return `https://www.youtube.com/watch?v=${video.embed_id}`
      case "tiktok":
        return `https://www.tiktok.com/@${tiktokUsername}/video/${video.embed_id}`
      case "twitter":
        return `https://x.com/i/status/${video.embed_id}`
      default:
        return "#"
    }
  }

  return (
    <section className="border-y border-border/50 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.07),transparent_34%)] py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <Piano className="size-6 text-primary" />
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Performance series
            </p>
          </div>

          <h2 className="text-3xl font-medium tracking-[-0.04em] md:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {description}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {validVideos.map(
            (video, index) => (
              <motion.div
                key={video.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
              >
                <Card className="group h-full overflow-hidden rounded-[1.5rem] border-border/50 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {video.platform ===
                    "youtube" ? (
                      activeVideo ===
                      video.id ? (
                        <iframe
                          src={getEmbedUrl(
                            video,
                          )}
                          title={video.title}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setActiveVideo(
                              video.id,
                            )
                          }
                          className="group/play absolute inset-0 h-full w-full"
                          aria-label={`Play ${video.title}`}
                        >
                          <ResilientImage
                            sources={
                              getThumbnailSources(
                                video,
                              )
                            }
                            alt=""
                            loading={
                              index === 0
                                ? "eager"
                                : "lazy"
                            }
                            fetchPriority={
                              index === 0
                                ? "high"
                                : "auto"
                            }
                            fallbackTone="music"
                            fallbackLabel={
                              video.title
                            }
                            fallbackDetail="YouTube performance"
                            className="object-cover transition-transform duration-700 group-hover/play:scale-[1.025]"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/play:bg-black/40">
                            <div className="flex size-16 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform group-hover/play:scale-105">
                              <Play className="ml-1 size-7 fill-current" />
                            </div>
                          </div>

                          {video.start_time && (
                            <div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
                              {video.start_time}
                              {video.end_time
                                ? ` – ${video.end_time}`
                                : ""}
                            </div>
                          )}
                        </button>
                      )
                    ) : video.platform ===
                      "tiktok" ? (
                      <TikTokVideoCard
                        video={video}
                        externalUrl={
                          getExternalUrl(
                            video,
                          )
                        }
                      />
                    ) : (
                      <a
                        href={getExternalUrl(
                          video,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/x absolute inset-0 block"
                      >
                        <ResilientImage
                          sources={[
                            video.thumbnail,
                          ]}
                          alt={video.title}
                          fallbackTone="music"
                          fallbackLabel={
                            video.title
                          }
                          fallbackDetail="Watch on X"
                          className="object-cover"
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover/x:bg-black/40">
                          <ExternalLink className="size-7 text-white" />
                        </div>
                      </a>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-medium">
                          {video.title}
                        </h3>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full border border-border/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {video.platform ===
                            "twitter"
                              ? "X"
                              : video.platform}
                          </span>

                          {video.start_time && (
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {video.start_time}
                            </span>
                          )}
                        </div>
                      </div>

                      <a
                        href={getExternalUrl(
                          video,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${video.title}`}
                        className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
