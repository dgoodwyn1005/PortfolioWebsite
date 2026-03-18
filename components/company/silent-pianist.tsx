"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Piano, Play, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Video {
  id: string
  title: string
  platform: "youtube" | "tiktok" | "twitter"
  embed_id: string
  thumbnail?: string | null
  start_time?: string | null
  end_time?: string | null
}

// Convert time string (HH:MM:SS or MM:SS) to seconds
function timeToSeconds(time: string | null | undefined): number | null {
  if (!time) return null
  const parts = time.split(":").map(Number)
  if (parts.some(isNaN)) return null
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

// TikTok embed component that loads the SDK
function TikTokEmbed({ videoId, title }: { videoId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement("script")
    script.src = "https://www.tiktok.com/embed.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup if needed
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [videoId])

  return (
    <div ref={containerRef} className="w-full min-h-[300px] flex items-center justify-center bg-muted overflow-hidden">
      <blockquote 
        className="tiktok-embed" 
        cite={`https://www.tiktok.com/@wynora/video/${videoId}`}
        data-video-id={videoId}
        style={{ maxWidth: "100%", minWidth: "250px" }}
      >
        <section className="flex flex-col items-center justify-center p-4 gap-2">
          <Play className="w-8 h-8 text-primary" />
          <a 
            href={`https://www.tiktok.com/@wynora/video/${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm text-center"
          >
            Watch {title} on TikTok
          </a>
        </section>
      </blockquote>
    </div>
  )
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

// YouTube video card with click-to-play functionality
function YouTubeVideoCard({ video, getEmbedUrl, getExternalUrl }: { 
  video: Video
  getEmbedUrl: (v: Video) => string | null
  getExternalUrl: (v: Video) => string 
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Get YouTube thumbnail - use maxresdefault for best quality, fallback to hqdefault
  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`
  
  return (
    <div className="relative aspect-video bg-muted overflow-hidden">
      {isPlaying ? (
        <iframe
          src={`${getEmbedUrl(video)}&autoplay=1`}
          title={video.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="w-full h-full relative group"
        >
          <img
            src={thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default thumbnail if maxres fails
              const target = e.target as HTMLImageElement
              if (!target.src.includes('hqdefault')) {
                target.src = `https://img.youtube.com/vi/${video.embed_id}/hqdefault.jpg`
              }
            }}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-colors">
              <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
          {video.start_time && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {video.start_time}{video.end_time ? ` - ${video.end_time}` : ""}
            </div>
          )}
        </button>
      )}
    </div>
  )
}

export function SilentPianist({ 
  videos, 
  title = "The Silent Pianist",
  description = "Watch performances and behind-the-scenes content from The Silent Pianist series"
}: SilentPianistProps) {
  // Filter to only show videos with valid IDs
  const validVideos = videos.filter(isValidVideoId)
  
  if (validVideos.length === 0) return null

  function getEmbedUrl(video: Video) {
    switch (video.platform) {
      case "youtube":
        let url = `https://www.youtube.com/embed/${video.embed_id}`
        const params = new URLSearchParams()
        const startSec = timeToSeconds(video.start_time)
        const endSec = timeToSeconds(video.end_time)
        if (startSec !== null) params.set("start", startSec.toString())
        if (endSec !== null) params.set("end", endSec.toString())
        const paramStr = params.toString()
        return paramStr ? `${url}?${paramStr}` : url
      default:
        return null
    }
  }

  function getExternalUrl(video: Video) {
    switch (video.platform) {
      case "youtube":
        return `https://www.youtube.com/watch?v=${video.embed_id}`
      case "tiktok":
        return `https://www.tiktok.com/@wynora/video/${video.embed_id}`
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
                    <YouTubeVideoCard 
                      video={video} 
                      getEmbedUrl={getEmbedUrl} 
                      getExternalUrl={getExternalUrl} 
                    />
                  ) : video.platform === "tiktok" ? (
                    <TikTokEmbed videoId={video.embed_id} title={video.title} />
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
