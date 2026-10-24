import Link from "next/link"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  ArrowUpRight,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Eye,
  FolderKanban,
  ImageIcon,
  Inbox,
  ShoppingCart,
  Sparkles,
  Video,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

function metric(count: number | null | undefined) {
  return count ?? 0
}

function percent(part: number, total: number) {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

function publishingLabel(visible: number, total: number) {
  if (total === 0) return "Nothing added yet"
  if (visible === total) return "Everything public"
  return `${visible} of ${total} public`
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/admin/login")

  const { data: role } = await supabase
    .from("user_roles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle()

  if (role?.is_admin !== true) redirect("/")

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [
    newLeadsRes,
    leads30Res,
    won30Res,
    notificationIssuesRes,
    recentLeadsRes,
    projectsTotalRes,
    projectsVisibleRes,
    galleryTotalRes,
    galleryVisibleRes,
    videosTotalRes,
    videosVisibleRes,
    servicesTotalRes,
    servicesVisibleRes,
    companiesActiveRes,
    testimonialsVisibleRes,
    ordersRes,
  ] = await Promise.all([
    supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo)
      .eq("status", "won"),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .in("owner_notification_status", ["failed", "skipped"]),
    supabase
      .from("contact_submissions")
      .select("id,name,email,status,selected_service,company_slug,created_at,owner_notification_status")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("photo_gallery").select("id", { count: "exact", head: true }),
    supabase.from("photo_gallery").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("videos").select("id", { count: "exact", head: true }),
    supabase.from("videos").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("company_services").select("id", { count: "exact", head: true }),
    supabase.from("company_services").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("companies").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("company_testimonials").select("id", { count: "exact", head: true }).eq("is_visible", true),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ])

  const newLeads = metric(newLeadsRes.count)
  const leads30 = metric(leads30Res.count)
  const won30 = metric(won30Res.count)
  const notificationIssues = metric(notificationIssuesRes.count)
  const conversionRate = percent(won30, leads30)

  const publishing = [
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
      visible: metric(projectsVisibleRes.count),
      total: metric(projectsTotalRes.count),
    },
    {
      label: "Life gallery",
      href: "/admin/gallery",
      icon: ImageIcon,
      visible: metric(galleryVisibleRes.count),
      total: metric(galleryTotalRes.count),
    },
    {
      label: "Videos",
      href: "/admin/videos",
      icon: Video,
      visible: metric(videosVisibleRes.count),
      total: metric(videosTotalRes.count),
    },
    {
      label: "Services",
      href: "/admin/companies/services",
      icon: BriefcaseBusiness,
      visible: metric(servicesVisibleRes.count),
      total: metric(servicesTotalRes.count),
    },
  ]

  const growthLoop = [
    {
      step: "01",
      title: "Capture",
      copy: "Respond to interest while intent is fresh. Keep every serious inquiry moving.",
      href: "/admin/submissions",
      label: `${newLeads} new lead${newLeads === 1 ? "" : "s"}`,
    },
    {
      step: "02",
      title: "Ship",
      copy: "Turn current work into something usable, public, and worth pointing people toward.",
      href: "/admin/projects",
      label: `${metric(projectsVisibleRes.count)} public projects`,
    },
    {
      step: "03",
      title: "Prove",
      copy: "Capture outcomes, testimonials, and case-study evidence before the details disappear.",
      href: "/admin/companies/testimonials",
      label: `${metric(testimonialsVisibleRes.count)} visible testimonials`,
    },
    {
      step: "04",
      title: "Sell",
      copy: "Keep services and pricing aligned with the level of work you can confidently deliver now.",
      href: "/admin/companies/services",
      label: `${metric(servicesVisibleRes.count)} live offers`,
    },
  ]

  const recentLeads = recentLeadsRes.data ?? []
  const attentionCount = newLeads + notificationIssues

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.7fr)]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                Control Center
              </Badge>
              <span className="text-xs text-muted-foreground">Built to keep compounding</span>
            </div>

            <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Run the work. Publish the proof. Build the next thing.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This is the operating layer behind Deshawn Goodwyn, Wyntech, and Wynora—not just a CMS. Use it to keep opportunities moving and your public body of work current as everything grows.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {["/", "/build", "/music", "/life", "/wyntech", "/wynora"].map((href) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {href === "/" ? "Home" : href.slice(1)}
                  <ArrowUpRight className="size-3" />
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-border/70 bg-muted/20 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Attention</p>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-[-0.06em]">{attentionCount}</span>
              <span className="pb-2 text-sm text-muted-foreground">items to review</span>
            </div>
            <div className="mt-6 space-y-3 border-t border-border/60 pt-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">New leads</span>
                <span className="font-medium">{newLeads}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Delivery issues</span>
                <span className="font-medium">{notificationIssues}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Orders recorded</span>
                <span className="font-medium">{metric(ordersRes.count)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operating pulse</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">What the system is telling you now</h2>
          </div>
          <Link href="/admin/submissions" className="hidden items-center gap-2 text-sm font-medium sm:flex">
            Open pipeline <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "New leads",
              value: newLeads.toString(),
              detail: "Needs a human response",
              icon: Inbox,
              href: "/admin/submissions",
            },
            {
              label: "Leads · 30 days",
              value: leads30.toString(),
              detail: "Current inbound velocity",
              icon: Sparkles,
              href: "/admin/submissions",
            },
            {
              label: "Conversion · 30 days",
              value: `${conversionRate}%`,
              detail: `${won30} marked won`,
              icon: CircleDollarSign,
              href: "/admin/submissions",
            },
            {
              label: "Notification health",
              value: notificationIssues === 0 ? "Clear" : notificationIssues.toString(),
              detail: notificationIssues === 0 ? "Owner alerts are healthy" : "Failed or skipped alerts",
              icon: notificationIssues === 0 ? CheckCircle2 : BellRing,
              href: "/admin/submissions",
            },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                  <CardTitle className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {item.label}
                  </CardTitle>
                  <item.icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold tracking-[-0.04em]">{item.value}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <section className="rounded-[1.5rem] border border-border/70 bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Recent interest</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Newest conversations</h2>
            </div>
            <Link href="/admin/submissions" className="flex size-9 items-center justify-center rounded-full border border-border/70 transition-colors hover:bg-muted" aria-label="View all leads">
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 divide-y divide-border/60 border-y border-border/60">
            {recentLeads.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">No leads yet. The pipeline is ready when they arrive.</div>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href="/admin/submissions"
                  className="grid gap-3 py-4 transition-colors hover:bg-muted/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-2"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{lead.name}</p>
                      <Badge variant={lead.status === "new" ? "default" : "secondary"} className="text-[10px] capitalize">
                        {lead.status}
                      </Badge>
                      {lead.company_slug && (
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {lead.company_slug}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {lead.selected_service || lead.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground sm:justify-end">
                    {lead.owner_notification_status === "sent" && <CheckCircle2 className="size-3.5" />}
                    <span>
                      {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-border/70 bg-foreground p-6 text-background">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/55">The compounding loop</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Every cycle should leave the system stronger.</h2>
          <p className="mt-3 text-sm leading-relaxed text-background/65">
            Inquiry becomes work. Work becomes proof. Proof sharpens the offer. The offer creates better inquiries. Keep that loop visible here for years, not weeks.
          </p>
          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-background/15">
            <div className="bg-foreground p-4">
              <p className="text-2xl font-semibold">{metric(companiesActiveRes.count)}</p>
              <p className="mt-1 text-[11px] text-background/55">active ventures</p>
            </div>
            <div className="bg-foreground p-4">
              <p className="text-2xl font-semibold">{metric(testimonialsVisibleRes.count)}</p>
              <p className="mt-1 text-[11px] text-background/55">visible proof points</p>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Publishing health</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">What the public can actually see</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {publishing.map((item) => (
            <Link key={item.label} href={item.href}>
              <Card className="h-full transition-colors hover:border-foreground/20">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{publishingLabel(item.visible, item.total)}</p>
                    </div>
                    <item.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-3xl font-semibold tracking-[-0.04em]">{item.visible}</span>
                    <span className="pb-1 text-xs text-muted-foreground">/ {item.total}</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground"
                      style={{ width: `${item.total === 0 ? 0 : percent(item.visible, item.total)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Growth loop</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em]">The four habits that keep this useful for life</h2>
          </div>
        </div>

        <div className="grid overflow-hidden rounded-[1.5rem] border border-border/70 bg-border/70 md:grid-cols-2 xl:grid-cols-4">
          {growthLoop.map((item) => (
            <Link key={item.step} href={item.href} className="group bg-card p-5 transition-colors hover:bg-muted/50 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">{item.step}</span>
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 min-h-16 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              <p className="mt-6 text-xs font-medium">{item.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <Eye className="mt-0.5 size-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Keep the admin boring in the right ways.</p>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Stable categories, preserved history, visible health, and fast paths to the work matter more than endlessly adding controls. New capabilities should fit this operating model instead of expanding one giant menu.
            </p>
          </div>
        </div>
        <Link href="/admin/settings" className="shrink-0 text-sm font-medium">
          Site settings <ArrowUpRight className="ml-1 inline size-4" />
        </Link>
      </section>
    </div>
  )
}
