import { ImageResponse } from "next/og"

const worlds = {
  build: { label: "01 / BUILD", headline: "Things made to be used.", detail: "Software · Products · Technology", accent: "#83c9ef", bg: "#101a29" },
  music: { label: "02 / MUSIC", headline: "At the piano.", detail: "Performance · Arranging · Recording", accent: "#e7bd82", bg: "#211910" },
  life: { label: "03 / LIFE", headline: "Still becoming.", detail: "Athletics · Experiences · Milestones", accent: "#9bd4b0", bg: "#12231b" },
} as const

export async function GET(_request: Request, { params }: { params: Promise<{ world: string }> }) {
  const { world } = await params
  if (!Object.hasOwn(worlds, world)) return new Response("Not found", { status: 404 })
  const item = worlds[world as keyof typeof worlds]
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "64px 72px", background: item.bg, color: "#fff", borderTop: "12px solid " + item.accent }}>
      <div style={{ display: "flex", fontSize: 26, color: item.accent, letterSpacing: "0.12em" }}>{item.label}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, maxWidth: 1020 }}>{item.headline}</div>
        <div style={{ display: "flex", fontSize: 29, marginTop: 22, color: "#d3d8dc" }}>{item.detail}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #687078", paddingTop: 24, fontSize: 23 }}><span>Deshawn Goodwyn</span><span style={{ color: item.accent }}>deshawngoodwyn.com</span></div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } }
  )
}
