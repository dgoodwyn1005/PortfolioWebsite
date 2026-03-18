"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  Link2,
  Folders,
  DollarSign,
  Video,
  BarChart3,
  LogOut,
  Home,
  Building2,
  Briefcase,
  Users,
  MessageSquare,
  ImageIcon,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Camera,
  Inbox,
  FileText,
  CreditCard,
  Music,
  Package,
} from "lucide-react"
import { useState } from "react"

const mainNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
  { name: "Stripe", href: "/admin/stripe", icon: CreditCard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Images", href: "/admin/images", icon: ImageIcon },
  { name: "Photo Gallery", href: "/admin/gallery", icon: Camera }, // Added Photo Gallery menu item
  { name: "Projects", href: "/admin/projects", icon: Folders },
  { name: "Social Links", href: "/admin/social-links", icon: Link2 },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Videos", href: "/admin/videos", icon: Video },
  { name: "Audio Clips", href: "/admin/audio", icon: Music },
  { name: "Quick Stats", href: "/admin/stats", icon: BarChart3 },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Submissions", href: "/admin/submissions", icon: Inbox }, // Added Submissions menu item
  { name: "Create Invoice", href: "/admin/invoices", icon: FileText }, // Added Invoices menu item
]

const companyNavItems = [
  { name: "Companies", href: "/admin/companies", icon: Building2 },
  { name: "Services", href: "/admin/companies/services", icon: Briefcase },
  { name: "Team", href: "/admin/companies/team", icon: Users },
  { name: "Testimonials", href: "/admin/companies/testimonials", icon: MessageSquare },
  { name: "Portfolio", href: "/admin/companies/portfolio", icon: ImageIcon },
  { name: "FAQs", href: "/admin/companies/faqs", icon: HelpCircle },
  { name: "Audio Samples", href: "/admin/companies/audio-samples", icon: Music },
  { name: "Silent Pianist", href: "/admin/companies/silent-pianist", icon: Video },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [companiesOpen, setCompaniesOpen] = useState(pathname.includes("/admin/companies"))

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
        <p className="text-xs text-muted-foreground">Portfolio Management</p>
      </div>

      <nav className="space-y-1 flex-1">
        {/* Main Portfolio Section */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Personal Portfolio
        </p>
        {mainNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}

        {/* Companies Section */}
        <div className="pt-4 mt-4 border-t border-border">
          <button
            onClick={() => setCompaniesOpen(!companiesOpen)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            <span>Companies</span>
            {companiesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {companiesOpen && (
            <div className="mt-1 space-y-1">
              {companyNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-border pt-4 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          View Site
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
