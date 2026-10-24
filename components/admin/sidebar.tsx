"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  Building2,
  Camera,
  ChevronDown,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Folders,
  HelpCircle,
  Home,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  MessageSquare,
  Music,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Video,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type NavItem = {
  name: string
  href: string
  icon: typeof LayoutDashboard
  exact?: boolean
}

type NavGroup = {
  name: string
  description: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    name: "Operate",
    description: "Leads, work, and money",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      { name: "Leads", href: "/admin/submissions", icon: Inbox },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Invoices", href: "/admin/invoices", icon: FileText },
    ],
  },
  {
    name: "Publish",
    description: "Your public body of work",
    items: [
      { name: "Site Settings", href: "/admin/settings", icon: Settings },
      { name: "Projects", href: "/admin/projects", icon: Folders },
      { name: "Photo Gallery", href: "/admin/gallery", icon: Camera },
      { name: "Videos", href: "/admin/videos", icon: Video },
      { name: "Audio Clips", href: "/admin/audio", icon: Music },
      { name: "Social Links", href: "/admin/social-links", icon: Link2 },
      { name: "Quick Stats", href: "/admin/stats", icon: BarChart3 },
    ],
  },
  {
    name: "Ventures",
    description: "Wyntech and Wynora",
    items: [
      { name: "Companies", href: "/admin/companies", icon: Building2, exact: true },
      { name: "Services", href: "/admin/companies/services", icon: Briefcase },
      { name: "Portfolio", href: "/admin/companies/portfolio", icon: ImageIcon },
      { name: "Testimonials", href: "/admin/companies/testimonials", icon: MessageSquare },
      { name: "FAQs", href: "/admin/companies/faqs", icon: HelpCircle },
      { name: "Team", href: "/admin/companies/team", icon: Users },
      { name: "Audio Samples", href: "/admin/companies/audio-samples", icon: Music },
      { name: "Silent Pianist", href: "/admin/companies/silent-pianist", icon: Video },
      { name: "Digital Products", href: "/admin/companies/digital-products", icon: Download },
    ],
  },
  {
    name: "Commerce",
    description: "Offers and payment systems",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
      { name: "Stripe", href: "/admin/stripe", icon: CreditCard },
    ],
  },
  {
    name: "System",
    description: "Reusable site assets",
    items: [{ name: "Images", href: "/admin/images", icon: ImageIcon }],
  },
]

function itemIsActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const initialOpen = Object.fromEntries(
    navGroups.map((group) => [
      group.name,
      group.name === "Operate" || group.items.some((item) => itemIsActive(pathname, item)),
    ]),
  ) as Record<string, boolean>

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border/60 px-4 pb-5 pt-5">
        <Link href="/admin" onClick={onNavigate} className="block">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-foreground text-sm font-semibold text-background">
              DG
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-[-0.02em] text-foreground">Control Center</p>
              <p className="truncate text-[11px] text-muted-foreground">Build · Music · Life</p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.name] ?? false
          const hasActiveItem = group.items.some((item) => itemIsActive(pathname, item))

          return (
            <div key={group.name} className="rounded-xl border border-transparent">
              <button
                type="button"
                onClick={() =>
                  setOpenGroups((current) => ({ ...current, [group.name]: !isOpen }))
                }
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                  hasActiveItem ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em]">{group.name}</span>
                  <span className="mt-0.5 block text-[10px] font-normal normal-case tracking-normal text-muted-foreground">
                    {group.description}
                  </span>
                </span>
                <ChevronDown className={cn("size-4 transition-transform", isOpen ? "rotate-180" : "")} />
              </button>

              {isOpen && (
                <div className="mt-1 space-y-1">
                  {group.items.map((item) => {
                    const active = itemIsActive(pathname, item)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={cn(
                          "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          active
                            ? "bg-foreground text-background shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="space-y-1 border-t border-border/60 p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Home className="size-4" />
          View public site
        </Link>
        <Button
          variant="ghost"
          className="h-10 w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-xs font-semibold text-background">DG</div>
          <div>
            <p className="text-sm font-semibold leading-none">Control Center</p>
            <p className="mt-1 text-[10px] text-muted-foreground">Operate · Publish · Grow</p>
          </div>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open admin navigation"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-4" />
        </Button>
      </div>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/70 bg-card/70 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close admin navigation"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,22rem)] border-r border-border bg-card shadow-2xl">
            <button
              type="button"
              aria-label="Close admin navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
