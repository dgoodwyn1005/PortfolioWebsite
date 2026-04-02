import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

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
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Save to database
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        company_slug: companySlug || null,
        submission_type: submissionType || "contact",
        status: "new",
        project_type: projectType || null,
        has_existing_website: hasExistingWebsite || null,
        budget_range: budgetRange || null,
        timeline: timeline || null,
        referral_source: referralSource || null,
        // Wynora fields
        event_type: eventType || null,
        event_date: eventDate || null,
        event_location: eventLocation || null,
        event_start_time: eventStartTime || null,
        event_end_time: eventEndTime || null,
        service_interest: serviceInterest || null,
        duration_needed: durationNeeded || null,
        piano_available: pianoAvailable || null,
        within_50_miles: within50Miles || null,
        song_requests: songRequests || null,
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
        // Use a simple email service or log for now
        // In production, integrate with SendGrid, Resend, or similar
        console.log(`[Contact Form] New submission from ${name} <${email}>`)
        console.log(`Subject: ${subject || "No subject"}`)
        console.log(`Message: ${message}`)
        console.log(`Company: ${companySlug || "Main site"}`)
        console.log(`Type: ${submissionType}`)
        console.log(`Admin email would be sent to: ${adminEmail}`)
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
        // Don't fail the request if email fails
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
