"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { motion } from "framer-motion"
import {
  Headphones,
  Music2,
  Pause,
  PenTool,
  Play,
} from "lucide-react"

interface AudioSample {
  id: string
  title: string
  description: string | null
  audio_url: string
  service_tier:
    | "accompaniment"
    | "live_performance"
    | "arrangement"
  duration: string | null
}

interface AudioSamplesProps {
  samples: AudioSample[]
}

const tierConfig = {
  accompaniment: {
    label: "Accompaniment",
    icon: Music2,
    waveColor: "#d6a85f",
    progressColor: "#9a6928",
  },
  live_performance: {
    label: "Live Performance",
    icon: Headphones,
    waveColor: "#d97706",
    progressColor: "#92400e",
  },
  arrangement: {
    label: "Arrangement",
    icon: PenTool,
    waveColor: "#8f9d82",
    progressColor: "#53644a",
  },
}

function WaveformPlayer({
  sample,
  index,
}: {
  sample: AudioSample
  index: number
}) {
  const containerRef =
    useRef<HTMLDivElement>(null)

  const wavesurferRef =
    useRef<any>(null)

  const [isPlaying, setIsPlaying] =
    useState(false)

  const [isReady, setIsReady] =
    useState(false)

  const [hasError, setHasError] =
    useState(false)

  const [currentTime, setCurrentTime] =
    useState(0)

  const [duration, setDuration] =
    useState(0)

  const tier =
    tierConfig[sample.service_tier] ||
    tierConfig.accompaniment

  const TierIcon = tier.icon

  useEffect(() => {
    let ws: any = null

    const initWaveSurfer = async () => {
      if (!containerRef.current) return

      const WaveSurfer = (
        await import("wavesurfer.js")
      ).default

      ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: tier.waveColor,
        progressColor:
          tier.progressColor,
        cursorColor: "transparent",
        barWidth: 2,
        barGap: 3,
        barRadius: 3,
        height: 58,
        normalize: true,
        backend: "WebAudio",
      })

      ws.load(sample.audio_url)

      ws.on("ready", () => {
        setIsReady(true)
        setHasError(false)
        setDuration(ws.getDuration())
        wavesurferRef.current = ws
      })

      ws.on("audioprocess", () => {
        setCurrentTime(
          ws.getCurrentTime(),
        )
      })

      ws.on("finish", () => {
        setIsPlaying(false)
        setCurrentTime(0)
      })

      ws.on("play", () =>
        setIsPlaying(true),
      )

      ws.on("pause", () =>
        setIsPlaying(false),
      )

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
  }, [
    sample.audio_url,
    tier.progressColor,
    tier.waveColor,
  ])

  const togglePlay = useCallback(() => {
    wavesurferRef.current?.playPause()
  }, [])

  const formatTime = (seconds: number) => {
    const mins =
      Math.floor(seconds / 60)

    const secs =
      Math.floor(seconds % 60)

    return `${mins}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="group h-full rounded-[1.5rem] border border-border/50 bg-card/75 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 sm:p-6">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-6 bg-border" />

            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <TierIcon className="size-3" />
              {tier.label}
            </span>
          </div>

          <h3 className="truncate text-lg font-medium tracking-[-0.025em] sm:text-xl">
            {sample.title}
          </h3>

          {sample.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {sample.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={togglePlay}
          disabled={!isReady || hasError}
          aria-label={
            isPlaying
              ? `Pause ${sample.title}`
              : `Play ${sample.title}`
          }
          className={[
            "flex size-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
            isReady && !hasError
              ? "border-foreground/15 bg-foreground text-background hover:scale-105"
              : "border-border bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {isPlaying ? (
            <Pause className="size-5" />
          ) : (
            <Play className="ml-0.5 size-5 fill-current" />
          )}
        </button>
      </div>

      <div className="relative mt-7 overflow-hidden rounded-xl border border-border/40 bg-muted/25 px-3 py-3">
        <div
          ref={containerRef}
          className={`w-full transition-opacity duration-300 ${
            isReady
              ? "opacity-100"
              : "opacity-35"
          }`}
        />

        {!isReady && !hasError && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-px w-20 animate-pulse bg-muted-foreground/30" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 px-4 text-center backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Recording temporarily unavailable
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>
          {duration > 0
            ? formatTime(duration)
            : sample.duration || "—"}
        </span>
      </div>
    </div>
  )
}

export function AudioSamples({
  samples,
}: AudioSamplesProps) {
  if (samples.length === 0) return null

  return (
    <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.07),transparent_36%)] py-20 sm:py-24 lg:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-16"
        >
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Program / Listening
          </p>

          <h2 className="mt-5 text-4xl font-medium tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            Listen first.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A few recordings before the explanation. Hear the touch, space, and arrangement before deciding what kind of performance fits the room.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {samples.map(
            (sample, index) => (
              <motion.div
                key={sample.id}
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
                <WaveformPlayer
                  sample={sample}
                  index={index}
                />
              </motion.div>
            ),
          )}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
          Headphones recommended, but not required.
        </p>
      </div>
    </section>
  )
}
