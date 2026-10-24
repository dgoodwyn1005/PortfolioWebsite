import type { Metadata } from "next"
import type React from "react"

import { AdminSidebar } from "@/components/admin/sidebar"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

// Admin pages depend on the current session and must never be prerendered.
export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isAdmin = false

  if (user) {
    const { data: role } = await supabase
      .from("user_roles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle()

    isAdmin = role?.is_admin === true
  }

  if (!isAdmin) {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <div className="min-h-screen bg-muted/10 lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
        <div className="mx-auto w-full max-w-[1500px]">{children}</div>
      </main>
    </div>
  )
}
