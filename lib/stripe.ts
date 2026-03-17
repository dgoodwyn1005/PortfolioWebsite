import "server-only"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"

async function getStripeKey(): Promise<string> {
  // Always prioritize environment variable if set
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY
  }

  // Fall back to database-stored key
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("site_settings").select("value").eq("key", "stripe_secret_key").single()

    if (data?.value && data.value.startsWith("sk_")) {
      return data.value
    }
  } catch (error) {
    // Fall through to error
  }

  throw new Error("STRIPE_SECRET_KEY is not set. Please configure Stripe in Admin → Stripe.")
}

// Create Stripe instance with custom or env key
export async function getStripe(): Promise<Stripe> {
  const key = await getStripeKey()
  return new Stripe(key, { apiVersion: "2024-12-18.acacia" })
}

// Legacy export for backwards compatibility (uses env var only)
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" })
  : null
