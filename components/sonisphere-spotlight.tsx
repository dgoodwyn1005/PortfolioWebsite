import Link from "next/link"
import { ArrowUpRight, ArrowRight, AudioLines, Orbit, Share2, MonitorPlay } from "lucide-react"
import { SonisphereEmbed } from "@/components/sonisphere-embed"
import type { Project } from "@/lib/content/projects"

export function isSonisphere(project: Project) {
  return project.title.trim().toLowerCase() === "sonisphere" || project.slug === "sonisphere"
}

const capabilities = [
  { icon: AudioLines, title: "Interpret", copy: "Real-time analysis of energy, rhythm, tonal movement and musical structure." },
  { icon: Orbit, title: "Generate", copy: "Seeded 3D worlds, authored visual presets, lighting and camera choreography." },
  { icon: Share2, title: "Create & share", copy: "Capture moments, publish durable Experiences and revisit or remix where permitted." },
  { icon: MonitorPlay, title: "Perform", copy: "Browser-based listening, mobile experiences and a dedicated live stage mode." },
]

export function SonisphereSpotlight({ project, detailed = false }: { project: Project; detailed?: boolean }) {
  return (
    <article id="sonisphere" aria-labelledby="sonisphere-title" className="portfolio-flagship scroll-mt-24 overflow-hidden border border-border/70 bg-card md:col-span-2 lg:col-span-12">
      <div className="grid lg:grid-cols-12">
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-5 lg:p-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Flagship product / Software × Music</p>
          <h2 id="sonisphere-title" className="mt-5 text-4xl font-medium tracking-[-0.055em] sm:text-5xl lg:text-6xl">{project.title}</h2>
          <p className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">Music, made spatial.</p>
          <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">A browser-based platform that interprets music in real time, transforms it into living 3D worlds, and lets people create, capture and share those experiences.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a data-portfolio-event="sonisphere_product_visit" href="https://www.sonisphere.dev/try" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4">Try Sonisphere <ArrowUpRight className="size-4" aria-hidden="true" /></a>
            {detailed ? <a href="https://www.sonisphere.dev/docs" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 border border-border px-5 py-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4">Product docs <ArrowUpRight className="size-4" aria-hidden="true" /></a> : <Link href="/build#sonisphere" className="inline-flex min-h-12 items-center gap-2 border border-border px-5 py-3 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-4">Behind the product <ArrowRight className="size-4" aria-hidden="true" /></Link>}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Explore in your browser · No download required</p>
        </div>
        <div className="sonisphere-stage relative flex min-h-64 items-center justify-center overflow-hidden border-t border-white/10 bg-[#08090d] p-4 sm:p-8 lg:col-span-7 lg:border-l lg:border-t-0">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(105,98,215,0.16),transparent_72%)]" />
          <div className="relative w-full overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-white/70"><span>Sonisphere / Interactive preview</span><span className="flex gap-1.5" aria-hidden="true"><i className="size-1.5 rounded-full bg-white/40"/><i className="size-1.5 rounded-full bg-white/40"/><i className="size-1.5 rounded-full bg-white/40"/></span></div>
            <SonisphereEmbed imageUrl={project.image_url} />
          </div>
        </div>
      </div>
      <div className="grid border-t border-border/70 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map(({icon: Icon, title, copy}) => <div key={title} className="border-b border-border/70 p-5 last:border-b-0 sm:border-r lg:border-b-0 lg:last:border-r-0 sm:p-6"><Icon className="size-5 text-muted-foreground" aria-hidden="true"/><h3 className="mt-4 font-medium">{title}</h3>{detailed && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>}</div>)}
      </div>
      {detailed && <div className="grid gap-8 border-t border-border/70 p-6 sm:p-10 lg:grid-cols-2">
        <div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">The idea</p><h3 className="mt-3 text-2xl font-medium tracking-tight">Where music meets software.</h3><p className="mt-3 leading-relaxed text-muted-foreground">Sonisphere began as an audio-reactive sphere and grew into a platform for musical interpretation, generated environments and shared visual experiences. It brings my interests in music and building software into the same product.</p></div>
        <div><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">The engineering</p><h3 className="mt-3 text-2xl font-medium tracking-tight">From sound to space.</h3><p className="mt-3 leading-relaxed text-muted-foreground">Web Audio analysis feeds a real-time rendering pipeline. Musical signals shape authored presets, deterministic worlds, motion and visual composition.</p><div className="mt-5 flex flex-wrap gap-2">{["Web Audio","Three.js","React Three Fiber","GLSL","TypeScript",...(project.tech ?? []).filter(t=>!["React-Three-Fiber","Shaders"].includes(t))].map(t=><span key={t} className="border border-border/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">{t}</span>)}</div>{project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">Source repository <ArrowUpRight className="size-4" aria-hidden="true"/></a>}</div>
      </div>}
    </article>
  )
}
