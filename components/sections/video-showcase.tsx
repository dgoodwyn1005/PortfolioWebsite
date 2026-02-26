"use client"

import { motion } from "framer-motion"
import { Play, ExternalLink } from "lucide-react"
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
}

export function VideoShowcase({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [tiktokThumbnails, setTiktokThumbnails] = useState<Record<string, string>>({})

  // Fetch TikTok thumbnails via oEmbed API
  useEffect(() => {
    const fetchTiktokThumbnails = async () => {
      const tiktokVideos = videos.filter((v) => v.platform === "tiktok" && !v.thumbnail_url)
      
      for (const video of tiktokVideos) {
        const videoId = video.youtube_id || video.embed_id
        const username = video.tiktok_username || "TheSilentPianist"
        const url = `https://www.tiktok.com/@${username}/video/${videoId}`
        
        try {
          const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`)
          if (response.ok) {
            const data = await response.json()
            if (data.thumbnail_url) {
              setTiktokThumbnails((prev) => ({ ...prev, [video.id]: data.thumbnail_url }))
            }
          }
        } catch {
          // Silently fail - will use fallback
        }
      }
    }

    fetchTiktokThumbnails()
  }, [videos])

  if (!videos || videos.length === 0) return null

  const sections = [...new Set(videos.map((v) => v.section || v.category).filter(Boolean))]
  const filteredVideos = activeFilter === "all" ? videos : videos.filter((v) => (v.section || v.category) === activeFilter)

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

        {sections.length > 1 && (
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveFilter(section as string)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  activeFilter === section
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => {
            const videoId = video.youtube_id || video.embed_id
            const isTikTok = video.platform === "tiktok"
            const isActive = activeVideo === video.id

            const tiktokUsername = video.tiktok_username || "TheSilentPianist"

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                {isTikTok ? (
                  <a
                    href={`https://www.tiktok.com/@${tiktokUsername}/video/${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[9/16] max-h-[400px] rounded-lg overflow-hidden bg-muted border flex flex-col items-center justify-center group-hover:scale-[1.02] transition-transform"
                  >
                    {(video.thumbnail_url || tiktokThumbnails[video.id]) ? (
                      <img
                        src={video.thumbnail_url || tiktokThumbnails[video.id]}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-background border">
                    {isActive ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
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
                            if (!video.thumbnail_url) {
                              target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                            <Play className="h-8 w-8 text-primary-foreground ml-1" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <h3 className="font-medium text-sm">{video.title}</h3>
                  {isTikTok && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">TikTok</span>
                  )}
                </div>
                {(video.category || video.section) && (
                  <p className="text-xs text-muted-foreground capitalize">{video.category || video.section}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
