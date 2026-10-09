import {
  createBrowserClient,
} from "@supabase/ssr"

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL

const supabasePublishableKey =
  process.env
    .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY

let client:
  | ReturnType<
      typeof createBrowserClient
    >
  | undefined

export function createClient() {
  if (
    !supabaseUrl ||
    !supabasePublishableKey
  ) {
    throw new Error(
      "Missing Supabase environment variables",
    )
  }

  if (!client) {
    client = createBrowserClient(
      supabaseUrl,
      supabasePublishableKey,
    )
  }

  return client
}