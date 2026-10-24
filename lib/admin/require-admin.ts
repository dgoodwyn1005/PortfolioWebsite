import "server-only"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

/**
 * Server-side authorization helper for admin pages.
 *
 * Route protection also exists in the proxy and admin shell, but pages should
 * use this helper when they need a Supabase client so authorization stays
 * database-backed and no page invents its own permission rule.
 */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: role } = await supabase
    .from("user_roles")
    .select("is_admin")
    .eq("user_id", user.id)
    .maybeSingle()

  if (role?.is_admin !== true) {
    redirect("/")
  }

  return { supabase, user }
}
