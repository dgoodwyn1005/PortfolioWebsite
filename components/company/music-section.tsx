"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ResilientImage } from "@/components/resilient-image"

interface AudioClip {
  id: string
  title: string
  artist: string | null
  description: string | null
  audio_url: string
  cover_image: string | null
  duration: string | null
  genre: string | null
}

interface MusicSectionProps {
  clips: AudioClip[]
  companyName?: string
}

export function MusicSection({ clips, companyName = "Our" }: MusicSectionProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  function togglePlay(clipId: string, audioUrl: string) {
    if (playingId === clipId) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }

    if (audioRef.current) {
      audioRef.current.pause()
    }

    audioRef.current = new Audio(audioUrl)
    audioRef.current.play()
    audioRef.current.onended = () => {
      setPlayingId(null)
      setProgress((prev) => ({ ...prev, [clipId]: 0 }))
    }
    audioRef.current.ontimeupdate = () => {
      if (audioRef.current) {
        const pct =
          (audioRef.current.currentTime /
            audioRef.current.duration) *
          100

        setProgress((prev) => ({
          ...prev,
          [clipId]: pct,
        }))
      }
    }
    setPlayingId(clipId)
  }

  if (clips.length === 0) return null

  return (
    <section className="bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Volume2 className="size-5 text-primary" />
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Deeper listening
            </p>
          </div>

          <h2 className="text-3xl font-medium tracking-[-0.04em] md:text-5xl">
            {companyName} Music
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tracks, recordings, and smaller musical moments that reward a closer listen.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip, index) => (
            <motion.div
              key={clip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <Card className="group h-full overflow-hidden rounded-[1.5rem] border-border/50 bg-card/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <ResilientImage
                    sources={[clip.cover_image]}
                    alt={clip.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    fallbackTone="music"
                    fallbackLabel={clip.title}
                    fallbackDetail={clip.artist || clip.genre || "Audio cover"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => togglePlay(clip.id, clip.audio_url)}
                      aria-label={
                        playingId === clip.id
                          ? `Pause ${clip.title}`
                          : `Play ${clip.title}`
                      }
                      className="flex size-16 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform duration-300 hover:scale-110"
                    >
                      {playingId === clip.id ? (
                        <Pause className="size-7" />
                      ) : (
                        <Play className="ml-1 size-7 fill-current" />
                      )}
                    </button>
                  </div>

                  {playingId === clip.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/25">
                      <div
                        className="h-full bg-white transition-all duration-100"
                        style={{ width: `${progress[clip.id] || 0}%` }}
                      />
                    </div>
                  )}
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-medium tracking-[-0.02em]">
                        {clip.title}
                      </h3>

                      {clip.artist && (
                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {clip.artist}
                        </p>
                      )}
                    </div>

                    {clip.duration && (
                      <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                        {clip.duration}
                      </span>
                    )}
                  </div>

                  {clip.description && (
                    <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {clip.description}
                    </p>
                  )}

                  {clip.genre && (
                    <div className="mt-5 border-t border-border/60 pt-4">
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {clip.genre}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
