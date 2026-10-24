"use client"

import { useSyncExternalStore } from "react"

const query = "(prefers-reduced-motion: reduce)"
const getSnapshot = () => window.matchMedia(query).matches
// Match the server and hydration render, and avoid entrance motion before the
// browser preference is known. useSyncExternalStore updates after hydration.
const getServerSnapshot = () => true
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
