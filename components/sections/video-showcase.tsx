"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Play, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"

interface Video {
  id: string
  title: string
  youtube_id?: string
  embed_id?: string
  tiktok_username?: string
  thumbnail_url?: string
  category?: string
  section?: string
  platform?: string
  start_time?: string
  end_time?: string
}

const DEFAULT_VISIBLE = 6

// Converts "MM:SS" or "HH:MM:SS" to total seconds for YouTube embed params
function timeToSeconds(time: string): number {
  if (!time) return 0
  const parts = time.trim().split(":").map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Number(parts[0]) || 0
}

// Builds the YouTube embed URL with autoplay and optional start/end times
function buildYouTubeEmbedUrl(videoId: string, startTime?: string, endTime?: string): string {
  const params = new URLSearchParams({ autoplay: "1" })
  if (startTime) {
    const startSeconds = timeToSeconds(startTime)
    if (startSeconds > 0) params.set("start", String(startSeconds))
  }
  if (endTime) {
    const endSeconds = timeToSeconds(endTime)
    if (endSeconds > 0) params.set("end", String(endSeconds))
  }
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

// Fetches TikTok thumbnail via oEmbed API when no thumbnail_url is stored
function useTikTokThumbnail(videoId: string, username: string, existingThumbnail?: string): string | null {
  const [thumbnail, setThumbnail] = useState<string | null>(existingThumbnail || null)

  useEffect(() => {
    if (existingThumbnail || !videoId) return
    const tiktokUrl = `https://www.tiktok.com/@${username}/video/${videoId}`
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`
    fetch(oembedUrl)
      .then((res) => res.json())
      .then((data) => { if (data.thumbnail_url) setThumbnail(data.thumbnail_url) })
      .catch(() => {})
  }, [videoId, username, existingThumbnail])

  return thumbnail
}

// Separate TikTok card so each one independently fetches its thumbnail
function TikTokCard({ video }: { video: Video }) {
  const videoId = video.embed_id || video.youtube_id || ""
  const username = video.tiktok_username || "TheSilentPianist"
  const thumbnail = useTikTokThumbnail(videoId, username, video.thumbnail_url)

  return (
    <a
      href={`https://www.tiktok.com/@${username}/video/${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="relative aspect-[9/16] max-h-[400px] rounded-lg overflow-hidden bg-muted border flex flex-col items-center justify-center group-hover:scale-[1.02] transition-transform block"
    >
      {thumbnail ? (
        <img src={thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" />
      )}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
        <span className="text-white font-medium flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Watch on TikTok
        </span>
      </div>
    </a>
  )
}

export function VideoShowcase({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [showAll, setShowAll] = useState(false)

  if (!videos || videos.length === 0) return null

  const sections = [...new Set(videos.map((v) => v.section || v.category).filter(Boolean))]
  const filteredVideos =
    activeFilter === "all" ? videos : videos.filter((v) => (v.section || v.category) === activeFilter)

  const visibleVideos = showAll ? filteredVideos : filteredVideos.slice(0, DEFAULT_VISIBLE)
  const hasMore = filteredVideos.length > DEFAULT_VISIBLE

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setShowAll(false)
    setActiveVideo(null)
  }

  const allTabs = ["all", ...sections] as string[]

  return (
    <section id="videos" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Videos</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Check out some of my latest content</p>
        </motion.div>

        {/* Sleek underline indicator filter tabs */}
        {sections.length > 1 && (
          <div className="flex justify-center mb-10">
            <div className="relative flex items-center gap-0 border-b border-border">
              {allTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`relative px-5 py-2.5 text-sm font-medium capitalize transition-colors duration-200 ${
                    activeFilter === tab
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {/* Video count badge */}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full transition-colors ${
                    activeFilter === tab
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {tab === "all"
                      ? videos.length
                      : videos.filter((v) => (v.section || v.category) === tab).length}
                  </span>
                  {/* Animated underline indicator */}
                  {activeFilter === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleVideos.map((video, index) => {
              const videoId = video.youtube_id || video.embed_id
              const isTikTok = video.platform === "tiktok"
              const isTwitter = video.platform === "twitter"
              const isActive = activeVideo === video.id

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  layout
                  className="group"
                >
                  {isTwitter ? (
                    <a
                      href={`https://x.com/i/status/${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted border flex flex-col items-center justify-center group-hover:scale-[1.02] transition-transform block"
                    >
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-black" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="text-white font-medium flex items-center gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Watch on X
                        </span>
                      </div>
                    </a>
                  ) : isTikTok ? (
                    <TikTokCard video={video} />
                  ) : (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-background border">
                      {isActive ? (
                        <iframe
                          src={buildYouTubeEmbedUrl(videoId!, video.start_time, video.end_time)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      ) : (
                        <button onClick={() => setActiveVideo(video.id)} className="absolute inset-0 w-full h-full">
                          <img
                            src={video.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              if (!video.thumbnail_url) target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                              <Play className="h-8 w-8 text-primary-foreground ml-1" />
                            </div>
                          </div>
                          {video.start_time && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {video.start_time}{video.end_time ? ` – ${video.end_time}` : ""}
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <h3 className="font-medium text-sm">{video.title}</h3>
                    {isTikTok && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">TikTok</span>
                    )}
                    {isTwitter && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">X</span>
                    )}
                  </div>
                  {(video.category || video.section) && (
                    <p className="text-xs text-muted-foreground capitalize">{video.category || video.section}</p>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Show More / Show Less button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground transition-colors duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show {filteredVideos.length - DEFAULT_VISIBLE} More
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
