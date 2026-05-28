import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// TODO: Add rate limiting (e.g. @upstash/ratelimit) to prevent spam
// TODO: Replace console.log email stub with real provider (Resend, SendGrid, etc.)

// Safe boolean coercion — prevents `false || null` evaluating to null
function toBoolOrNull(value: unknown): boolean | null {
  if (value === true || value === "true") return true
  if (value === false || value === "false") return false
  return null
}

// Safe string coercion — returns null for empty/nullish values
function toStrOrNull(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") return value.trim()
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      subject,
      message,
      companySlug,
      submissionType,
      // Wyntech fields
      projectType,
      hasExistingWebsite,
      budgetRange,
      timeline,
      referralSource,
      // Wynora fields
      eventType,
      eventDate,
      eventLocation,
      eventStartTime,
      eventEndTime,
      serviceInterest,
      durationNeeded,
      pianoAvailable,
      within50Miles,
      songRequests,
    } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Convert hasExistingWebsite string to boolean for database
    let hasExistingWebsiteBoolean: boolean | null = null
    if (hasExistingWebsite === "yes" || hasExistingWebsite === "redesign") {
      hasExistingWebsiteBoolean = true
    } else if (hasExistingWebsite === "no") {
      hasExistingWebsiteBoolean = false
    }

    // Save to database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject: toStrOrNull(subject),
        message,
        company_slug: toStrOrNull(companySlug),
        submission_type: toStrOrNull(submissionType) ?? "contact",
        status: "new",
        // Wyntech fields
        project_type: toStrOrNull(projectType),
        has_existing_website: hasExistingWebsiteBoolean,
        budget_range: toStrOrNull(budgetRange),
        timeline: toStrOrNull(timeline),
        referral_source: toStrOrNull(referralSource),
        // Wynora fields
        event_type: toStrOrNull(eventType),
        event_date: toStrOrNull(eventDate),
        event_location: toStrOrNull(eventLocation),
        event_start_time: toStrOrNull(eventStartTime),
        event_end_time: toStrOrNull(eventEndTime),
        service_interest: toStrOrNull(serviceInterest),
        duration_needed: toStrOrNull(durationNeeded),
        piano_available: toBoolOrNull(pianoAvailable),   // fixed: false no longer becomes null
        within_50_miles: toBoolOrNull(within50Miles),    // fixed: false no longer becomes null
        song_requests: toStrOrNull(songRequests),
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving submission:", error)
      return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
    }

    const { data: emailSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_email")
      .single()

    const adminEmail = emailSetting?.value

    if (adminEmail) {
      try {
        // TODO: Replace with real email provider
        // Example with Resend:
        //   await resend.emails.send({
        //     from: "noreply@yourdomain.com",
        //     to: adminEmail,
        //     subject: `New contact form submission from ${name}`,
        //     html: `...`,
        //   })
        console.log(`[Contact Form] New submission from ${name} <${email}>`)
        console.log(`Subject: ${subject || "No subject"}`)
        console.log(`Message: ${message}`)
        console.log(`Company: ${companySlug || "Main site"}`)
        console.log(`Type: ${submissionType}`)
        console.log(`Admin email would be sent to: ${adminEmail}`)
      } catch (emailError) {
        // Email failure is non-fatal — submission is already saved
        console.error("Failed to send email notification:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      data,
      message: "Your message has been received. We'll get back to you soon!",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
