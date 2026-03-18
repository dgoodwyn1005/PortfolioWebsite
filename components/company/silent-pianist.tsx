"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Piano, Play, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

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

// Convert time string (HH:MM:SS or MM:SS) to seconds
function timeToSeconds(time: string | null | undefined): number | null {
  if (!time) return null
  const parts = time.split(":").map(Number)
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  }
  return null
}

interface SilentPianistProps {
  videos: Video[]
  title?: string
  description?: string
}



// Check if a video ID appears to be a valid/real ID (not a placeholder)
function isValidVideoId(video: Video): boolean {
  // Filter out known placeholder IDs
  const placeholderIds = ['dQw4w9WgXcQ', '7339123456789012345', 'placeholder', 'test', 'example']
  if (placeholderIds.includes(video.embed_id)) return false
  // Check if embed_id has reasonable length
  if (!video.embed_id || video.embed_id.length < 5) return false
  return true
}

export function SilentPianist({ 
  videos, 
  title = "The Silent Pianist",
  description = "Watch performances and behind-the-scenes content from The Silent Pianist series"
}: SilentPianistProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  
  // Filter to only show videos with valid IDs
  const validVideos = videos.filter(isValidVideoId)
  
  if (validVideos.length === 0) return null

  function getEmbedUrl(video: Video) {
    switch (video.platform) {
      case "youtube":
        // Note: YouTube's "end" parameter doesn't work in embeds (deprecated)
        // Only "start" is reliable for controlling playback start time
        const baseUrl = `https://www.youtube.com/embed/${video.embed_id}`
        const startSec = timeToSeconds(video.start_time)
        // Always return URL with ? so we can append &autoplay=1 later
        if (startSec !== null && startSec > 0) {
          return `${baseUrl}?start=${startSec}`
        }
        return `${baseUrl}?rel=0`
      default:
        return null
    }
  }

  function getThumbnailUrl(video: Video) {
    if (video.thumbnail) return video.thumbnail
    if (video.platform === "youtube") {
      return `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`
    }
    return null
  }

  function getExternalUrl(video: Video) {
    const tiktokUsername = video.tiktok_username || "TheSilentPianist"
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Piano className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow h-full">
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {video.platform === "youtube" ? (
                    activeVideo === video.id ? (
                      <iframe
                        src={(() => {
                          const baseUrl = `https://www.youtube.com/embed/${video.embed_id}`
                          const startSec = timeToSeconds(video.start_time)
                          const params = new URLSearchParams()
                          params.set("autoplay", "1")
                          if (startSec !== null && startSec > 0) {
                            params.set("start", startSec.toString())
                          }
                          return `${baseUrl}?${params.toString()}`
                        })()}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        onClick={() => setActiveVideo(video.id)}
                        className="absolute inset-0 w-full h-full group/play"
                      >
                        <img
                          src={getThumbnailUrl(video) || ""}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-8 w-8 text-primary-foreground ml-1" />
                          </div>
                        </div>
                      </button>
                    )
                  ) : video.platform === "tiktok" ? (
                    <a
                      href={getExternalUrl(video)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center group/tiktok"
                    >
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover/tiktok:opacity-100 transition-opacity">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <span className="text-white font-medium flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Watch on TikTok
                        </span>
                      </div>
                    </a>
                  ) : (
                    <a
                      href={getExternalUrl(video)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 transition-colors"
                    >
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <Play className="w-12 h-12 text-primary mb-2" />
                          <span className="text-sm text-muted-foreground">Watch on X</span>
                        </>
                      )}
                    </a>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate flex-1">{video.title}</h3>
                    <a
                      href={getExternalUrl(video)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded-full">
                      {video.platform === "twitter" ? "X" : video.platform}
                    </span>
                    {video.start_time && (
                      <span className="text-xs text-muted-foreground">
                        {video.start_time}{video.end_time ? ` - ${video.end_time}` : ""}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
