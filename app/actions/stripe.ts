"use server"

import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

export async function createCheckoutSession(serviceId: string, serviceType: "pricing" | "company_service") {
  const stripe = await getStripe()
  const supabase = await createClient()

  let service: any
  let companyId: string | null = null

  if (serviceType === "pricing") {
    const { data } = await supabase.from("pricing").select("*").eq("id", serviceId).single()
    service = data
  } else {
    const { data } = await supabase.from("company_services").select("*, companies(name)").eq("id", serviceId).single()
    service = data
    companyId = data?.company_id
  }

  if (!service) {
    throw new Error("Service not found")
  }

  if (!service.is_available) {
    throw new Error("Service is not available")
  }

  const priceMatch = service.price?.toString().match(/\$?([\d,]+)/)
  const priceInDollars = priceMatch ? Number.parseInt(priceMatch[1].replace(/,/g, "")) : 0
  const priceInCents = priceInDollars * 100

  if (!priceInCents || priceInCents <= 0) {
    throw new Error("Invalid price")
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        price_data: {
          currency: service.currency || "usd",
          product_data: {
            name: service.title,
            description: service.description || undefined,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    redirect_on_completion: "never",
    metadata: {
      service_id: serviceId,
      service_type: serviceType,
      company_id: companyId || "",
    },
  })

  await supabase.from("orders").insert({
    service_id: serviceId,
    service_type: serviceType,
    company_id: companyId,
    amount_paid: priceInCents,
    currency: service.currency || "usd",
    stripe_session_id: session.id,
    status: "pending",
    user_email: "pending",
  })

  return session.client_secret
}

export async function getSessionStatus(sessionId: string) {
  const stripe = await getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)

  if (session.payment_status === "paid") {
    const supabase = await createClient()
    await supabase
      .from("orders")
      .update({
        status: "completed",
        user_email: session.customer_details?.email || "unknown",
        user_name: session.customer_details?.name,
        stripe_payment_intent: session.payment_intent as string,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", sessionId)
  }

  return {
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details?.email,
  }
}
