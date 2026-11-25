"use client"

import { useEffect, useRef, useState } from "react"
import { Play, X, ArrowUpRight } from "lucide-react"
import { ResilientImage } from "@/components/resilient-image"

const embedUrl = "https://www.sonisphere.dev/embed"

export function SonisphereEmbed({ imageUrl }: { imageUrl: string | null }) {
  const [active, setActive] = useState(false)
  const [ready, setReady] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const iframe = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!active) return
    const onMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.sonisphere.dev" && event.source === iframe.current?.contentWindow && event.data?.type === "sonisphere:embed-ready") {
        setReady(true)
        setTimedOut(false)
      }
    }
    window.addEventListener("message", onMessage)
    const timer = window.setTimeout(() => setTimedOut(true), 15000)
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setActive(false)
    }) : null
    if (container.current) observer?.observe(container.current)
    return () => {
      window.removeEventListener("message", onMessage)
      window.clearTimeout(timer)
      observer?.disconnect()
    }
  }, [active])

  return (
    <div ref={container} className="relative bg-black">
      <div className="relative aspect-[4/3] sm:aspect-video">
        {active ? (
          <iframe ref={iframe} src={embedUrl} title="Live Sonisphere interactive music visualizer" allow="autoplay; fullscreen" allowFullScreen loading="eager" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" className="absolute inset-0 h-full w-full border-0" />
        ) : (
          <>
            <ResilientImage sources={[imageUrl]} alt="Sonisphere project preview" loading="lazy" fallbackTone="build" fallbackLabel="Sonisphere" fallbackDetail="Interactive music experience" className="object-contain" />
            <button type="button" onClick={() => { setReady(false); setTimedOut(false); setActive(true) }} className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-[-4px]">
              <span className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/30 bg-black/85 px-5 py-3 text-sm font-medium text-white"><Play className="size-4 fill-current" aria-hidden="true" /> Load live demo</span>
            </button>
          </>
        )}
      </div>
      {active && <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/15 px-3 py-2 text-xs text-white/80">
        <span aria-live="polite">{ready ? "Live Sonisphere" : timedOut ? "Embed unavailable or still loading" : "Connecting to Sonisphere…"}</span>
        <div className="flex items-center gap-3">
          <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4">Open separately <ArrowUpRight className="size-3" aria-hidden="true" /></a>
          <button type="button" onClick={() => setActive(false)} className="inline-flex min-h-10 items-center gap-1 underline underline-offset-4"><X className="size-3" aria-hidden="true" /> Close demo</button>
        </div>
      </div>}
    </div>
  )
}
