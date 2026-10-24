"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

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

  const [sourceIndex, setSourceIndex] =
    useState(0)

  const [loaded, setLoaded] =
    useState(false)

  const [retryToken, setRetryToken] =
    useState(0)

  const source =
    normalizedSources[sourceIndex] ?? null

  useEffect(() => {
    setSourceIndex(0)
    setLoaded(false)
  }, [sourceKey])

  useEffect(() => {
    const retry = () => {
      if (
        sourceIndex >=
        normalizedSources.length
      ) {
        setSourceIndex(0)
        setLoaded(false)
        setRetryToken((value) =>
          value + 1,
        )
      }
    }

    window.addEventListener(
      "online",
      retry,
    )

    return () => {
      window.removeEventListener(
        "online",
        retry,
      )
    }
  }, [
    normalizedSources.length,
    sourceIndex,
  ])

  const handleError = () => {
    setLoaded(false)

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
          key={`${source}-${retryToken}`}
          src={source}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
            loaded
              ? "opacity-100"
              : "opacity-0"
          } ${className}`}
        />
      ) : alt ? (
        <span className="sr-only">
          {alt}
        </span>
      ) : null}
    </div>
  )
}
