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
  category?: string
  section?: string
  platform?: string
}

export function VideoShowcase({ videos }: { videos: Video[] }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Load TikTok embed script
  useEffect(() => {
    const hasTikTok = videos.some((v) => v.platform === "tiktok")
    if (hasTikTok && typeof window !== "undefined") {
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]')
      if (!existingScript) {
        const script = document.createElement("script")
        script.src = "https://www.tiktok.com/embed.js"
        script.async = true
        document.body.appendChild(script)
      }
    }
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
                  <div className="relative rounded-lg overflow-hidden bg-background border flex flex-col items-center justify-center p-4" style={{ minHeight: "400px" }}>
                    <blockquote
                      className="tiktok-embed"
                      cite={`https://www.tiktok.com/@${tiktokUsername}/video/${videoId}`}
                      data-video-id={videoId}
                      style={{ maxWidth: "325px", minWidth: "280px" }}
                    >
                      <section>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`https://www.tiktok.com/@${tiktokUsername}/video/${videoId}`}
                          className="flex items-center gap-2 text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Watch on TikTok
                        </a>
                      </section>
                    </blockquote>
                  </div>
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
                          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
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
