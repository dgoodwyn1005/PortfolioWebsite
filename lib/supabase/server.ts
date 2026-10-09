import "server-only"

import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// Support your existing legacy variable while allowing migration
// to Supabase's newer publishable-key format.
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY

function requirePublicEnvironment() {
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    )
  }

  return {
    url: supabaseUrl,
    key: supabasePublishableKey,
  }
}

/**
 * Public server client
 *
 * Use for publicly readable content that does not depend on the
 * current user's Supabase session.
 *
 * Examples:
 * - homepage content
 * - public projects
 * - public videos
 * - site settings
 * - public social links
 */
export function createPublicClient() {
  const { url, key } = requirePublicEnvironment()

  return createSupabaseClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

/**
 * Authenticated SSR client
 *
 * Use when the request needs access to the current user's
 * Supabase session.
 */
export async function createClient() {
  const { url, key } = requirePublicEnvironment()

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              cookieStore.set(name, value, options)
            }
          )
        } catch {
          // Server Components cannot always write cookies.
          // Session refresh should be handled by middleware/proxy.
        }
      },
    },
  })
}

/**
 * Elevated server-only client
 *
 * Never expose this client or its key to the browser.
 */
export function createAdminClient() {
  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!supabaseSecretKey) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY"
    )
  }

  return createSupabaseClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )
}