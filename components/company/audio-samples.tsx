"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Music2, Headphones, PenTool } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AudioSample {
  id: string
  title: string
  description: string | null
  audio_url: string
  service_tier: "accompaniment" | "live_performance" | "arrangement"
  duration: string | null
}

interface AudioSamplesProps {
  samples: AudioSample[]
}

const tierConfig = {
  accompaniment: {
    label: "Accompaniment",
    icon: Music2,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    waveColor: "#3b82f6",
    progressColor: "#1d4ed8",
  },
  live_performance: {
    label: "Live Performance",
    icon: Headphones,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    waveColor: "#f59e0b",
    progressColor: "#d97706",
  },
  arrangement: {
    label: "Arrangement",
    icon: PenTool,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    waveColor: "#10b981",
    progressColor: "#059669",
  },
}

function WaveformPlayer({ sample }: { sample: AudioSample }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const tier = tierConfig[sample.service_tier] || tierConfig.accompaniment
  const TierIcon = tier.icon

  useEffect(() => {
    let ws: any = null

    const initWaveSurfer = async () => {
      if (!containerRef.current) return

      const WaveSurfer = (await import("wavesurfer.js")).default

      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: tier.waveColor,
        progressColor: tier.progressColor,
        cursorColor: "transparent",
        barWidth: 3,
        barGap: 2,
        barRadius: 3,
        height: 60,
        normalize: true,
        backend: "WebAudio",
      })

      ws.load(sample.audio_url)

      ws.on("ready", () => {
        setIsReady(true)
        setDuration(ws.getDuration())
        wavesurferRef.current = ws
      })

      ws.on("audioprocess", () => {
        setCurrentTime(ws.getCurrentTime())
      })

      ws.on("finish", () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      ws.on("play", () => setIsPlaying(true))
      ws.on("pause", () => setIsPlaying(false))
      ws.on("error", () => {
        setHasError(true)
        setIsReady(false)
      })
    }

    initWaveSurfer()

    return () => {
      if (ws) {
        ws.destroy()
      }
    }
  }, [sample.audio_url, tier.waveColor, tier.progressColor])

  const togglePlay = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`${tier.color} text-xs`}>
                <TierIcon className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{tier.label}</span>
                <span className="sm:hidden">{tier.label.split(' ')[0]}</span>
              </Badge>
            </div>
            <h3 className="font-semibold text-base sm:text-lg truncate">{sample.title}</h3>
            {sample.description && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{sample.description}</p>
            )}
          </div>
          <button
            onClick={togglePlay}
            disabled={!isReady || hasError}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
              isReady && !hasError
                ? "bg-primary text-primary-foreground hover:scale-110 hover:shadow-lg"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
            )}
          </button>
        </div>

        <div className="relative">
          <div
            ref={containerRef}
            className={`w-full rounded-lg overflow-hidden transition-opacity duration-300 ${
              isReady ? "opacity-100" : "opacity-50"
            }`}
          />
          {!isReady && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Audio sample coming soon</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function AudioSamples({ samples }: AudioSamplesProps) {
  if (samples.length === 0) return null

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hear the Difference</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Listen to sample recordings from each of our service tiers. Experience the quality and artistry that goes into every performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {samples.map((sample, index) => (
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <WaveformPlayer sample={sample} />
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          Each sample represents the quality and attention to detail you can expect from our services.
        </motion.p>
      </div>
    </section>
  )
}
