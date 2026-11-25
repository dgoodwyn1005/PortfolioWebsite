"use client"

import { useEffect } from "react"
import { track } from "@vercel/analytics"

const events = new Set(["sonisphere_demo_launch", "sonisphere_demo_external", "sonisphere_product_visit", "video_player_launch", "video_external_open"])

export function PortfolioEngagement() {
  useEffect(() => {
    function record(event: MouseEvent) {
      if (!(event.target instanceof Element)) return
      const control = event.target.closest<HTMLElement>("[data-portfolio-event]")
      const name = control?.dataset.portfolioEvent
      if (!control || !name || !events.has(name)) return
      const page = window.location.pathname
      if (!["/", "/build", "/music", "/life", "/wynora"].includes(page)) return
      const props: Record<string, string> = { page }
      const id = control.dataset.contentId
      if (id && /^[a-zA-Z0-9_-]{1,64}$/.test(id)) props.content_id = id
      const platform = control.dataset.videoPlatform
      if (platform === "youtube" || platform === "tiktok") props.platform = platform
      try { track(name, props) } catch { /* analytics cannot block the interaction */ }
    }
    document.addEventListener("click", record, true)
    return () => document.removeEventListener("click", record, true)
  }, [])
  return null
}
