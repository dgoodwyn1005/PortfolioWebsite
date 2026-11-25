"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { getImageProps } from "next/image"

import {
  ImageOff,
} from "lucide-react"

type FallbackTone =
  | "neutral"
  | "build"
  | "music"
  | "life"

interface ResilientImageProps {
  sources: Array<string | null | undefined>
  alt: string
  className?: string
  fallbackLabel?: string
  fallbackDetail?: string
  fallbackTone?: FallbackTone
  loading?: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
  decoding?: "sync" | "async" | "auto"
  sizes?: string
}

const toneClasses: Record<FallbackTone, string> = {
  neutral:
    "from-muted via-background to-muted/60",
  build:
    "from-primary/12 via-background to-muted",
  music:
    "from-amber-500/10 via-background to-primary/10",
  life:
    "from-fuchsia-500/10 via-background to-emerald-500/10",
}

export function ResilientImage({
  sources,
  alt,
  className = "",
  fallbackLabel,
  fallbackDetail,
  fallbackTone = "neutral",
  loading = "lazy",
  fetchPriority = "auto",
  decoding = "async",
  sizes,
}: ResilientImageProps) {
  const normalizedSources = useMemo(
    () =>
      Array.from(
        new Set(
          sources.filter(
            (
              source,
            ): source is string =>
              Boolean(source?.trim()),
          ),
        ),
      ),
    [sources],
  )

  const sourceKey =
    normalizedSources.join("|")

  const imageRef =
    useRef<HTMLImageElement>(null)

  const [sourceIndex, setSourceIndex] =
    useState(0)

  const [retryToken, setRetryToken] =
    useState(0)

  const source =
    normalizedSources[sourceIndex] ?? null

  const [originalSource, setOriginalSource] = useState<string | null>(null)
  // Optimize known public image stores only. Never proxy signed/private or arbitrary URLs.
  const optimized = useMemo(() => {
    if (!source || !sizes || originalSource === source) return null
    try {
      const url = new URL(source)
      const publicBlob = url.hostname.endsWith(".public.blob.vercel-storage.com")
      const publicStorage = url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/storage/v1/object/public/")
      if (url.protocol !== "https:" || url.search || !(publicBlob || publicStorage)) return null
      return getImageProps({ src: source, alt, fill: true, sizes, quality: 75 }).props
    } catch { return null }
  }, [source, sizes, originalSource, alt])

  useEffect(() => {
    setSourceIndex(0)
  }, [sourceKey])

  // A cached image can finish before React hydrates and attaches
  // onLoad/onError handlers. Successful images should paint without
  // waiting on React state; this effect only recovers a missed error
  // so the next fallback source can be attempted.
  useEffect(() => {
    const image = imageRef.current

    if (!source || !image) {
      return
    }

    if (
      image.complete &&
      image.naturalWidth === 0
    ) {
      if (optimized) setOriginalSource(source)
      else setSourceIndex((current) => current + 1)
    }
  }, [source, retryToken, optimized])

  useEffect(() => {
    const retryIfNeeded = () => {
      if (
        sourceIndex >=
        normalizedSources.length
      ) {
        setSourceIndex(0)
        setRetryToken((value) =>
          value + 1,
        )
        return
      }

      const image = imageRef.current

      if (!image) {
        return
      }

      if (
        image.complete &&
        image.naturalWidth > 0
      ) {
        return
      }

      const rect =
        image.getBoundingClientRect()

      const isNearViewport =
        loading === "eager" ||
        (
          rect.bottom >=
            -window.innerHeight &&
          rect.top <=
            window.innerHeight * 2
        )

      if (isNearViewport) {
        setRetryToken((value) =>
          value + 1,
        )
      }
    }

    const retryWhenVisible = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        retryIfNeeded()
      }
    }

    window.addEventListener(
      "online",
      retryIfNeeded,
    )

    window.addEventListener(
      "focus",
      retryIfNeeded,
    )

    document.addEventListener(
      "visibilitychange",
      retryWhenVisible,
    )

    return () => {
      window.removeEventListener(
        "online",
        retryIfNeeded,
      )

      window.removeEventListener(
        "focus",
        retryIfNeeded,
      )

      document.removeEventListener(
        "visibilitychange",
        retryWhenVisible,
      )
    }
  }, [
    loading,
    normalizedSources.length,
    sourceIndex,
  ])

  const handleError = () => {
    if (optimized) { setOriginalSource(source); return }
    setSourceIndex((current) =>
      current + 1,
    )
  }

  const initials = (
    fallbackLabel ||
    alt ||
    "Media"
  )
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  return (
    <div className="absolute inset-0 overflow-hidden bg-muted">
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-gradient-to-br ${toneClasses[fallbackTone]}`}
      >
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:34px_34px] text-border" />

        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-xs text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-border/60 bg-background/70 text-sm font-semibold tracking-[0.12em] text-foreground shadow-sm backdrop-blur">
              {initials || (
                <ImageOff className="size-5" />
              )}
            </div>

            {fallbackLabel && (
              <p className="mt-4 text-sm font-medium text-foreground">
                {fallbackLabel}
              </p>
            )}

            <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {fallbackDetail ||
                "Preview unavailable"}
            </p>
          </div>
        </div>
      </div>

      {source ? (
        <img
          ref={imageRef}
          key={`${source}-${retryToken}-${optimized ? "optimized" : "original"}`}
          src={optimized?.src ?? source}
          srcSet={optimized?.srcSet}
          sizes={optimized?.sizes}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          onError={handleError}
          className={`absolute inset-0 h-full w-full ${className}`}
        />
      ) : alt ? (
        <span className="sr-only">
          {alt}
        </span>
      ) : null}
    </div>
  )
}
