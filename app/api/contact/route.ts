import {
  type NextRequest,
  NextResponse,
} from "next/server"

import {
  createAdminClient,
} from "@/lib/supabase/server"

const MAX_BODY_BYTES = 25_000

const limits = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5_000,

  companySlug: 100,
  submissionType: 100,

  eventLocation: 300,
  songRequests: 2_000,
} as const

class ValidationError extends Error {}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  )
}

function toStringOrNull(
  value: unknown,
  maxLength = 500,
): string | null {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  if (trimmed.length > maxLength) {
    throw new ValidationError(
      `A field exceeds the maximum length of ${maxLength} characters.`,
    )
  }

  return trimmed
}

function requireString(
  value: unknown,
  field: string,
  maxLength: number,
): string {
  const result = toStringOrNull(
    value,
    maxLength,
  )

  if (!result) {
    throw new ValidationError(
      `${field} is required.`,
    )
  }

  return result
}

function normalizeEmail(
  value: unknown,
): string {
  const email = requireString(
    value,
    "Email",
    limits.email,
  ).toLowerCase()

  /*
   * Intentionally simple validation.
   *
   * We're checking for an obviously usable email,
   * not trying to reproduce the complete RFC.
   */
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    throw new ValidationError(
      "Please enter a valid email address.",
    )
  }

  return email
}

function enumOrNull<
  const T extends readonly string[],
>(
  value: unknown,
  allowed: T,
  field: string,
): T[number] | null {
  const normalized =
    toStringOrNull(value, 100)

  if (!normalized) {
    return null
  }

  if (
    !allowed.includes(
      normalized as T[number],
    )
  ) {
    throw new ValidationError(
      `Invalid ${field}.`,
    )
  }

  return normalized as T[number]
}

function yesNoOrNotSure(
  value: unknown,
  field: string,
) {
  return enumOrNull(
    value,
    ["yes", "no", "not-sure"] as const,
    field,
  )
}

function existingWebsiteOrNull(
  value: unknown,
): boolean | null {
  const normalized = enumOrNull(
    value,
    [
      "yes",
      "no",
      "redesign",
    ] as const,
    "existing website option",
  )

  if (!normalized) {
    return null
  }

  return (
    normalized === "yes" ||
    normalized === "redesign"
  )
}

function dateOrNull(
  value: unknown,
): string | null {
  const date =
    toStringOrNull(value, 10)

  if (!date) {
    return null
  }

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      date,
    )
  ) {
    throw new ValidationError(
      "Invalid event date.",
    )
  }

  const parsed = new Date(
    `${date}T00:00:00`,
  )

  if (
    Number.isNaN(parsed.getTime())
  ) {
    throw new ValidationError(
      "Invalid event date.",
    )
  }

  return date
}

function timeOrNull(
  value: unknown,
): string | null {
  const time =
    toStringOrNull(value, 5)

  if (!time) {
    return null
  }

  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(
      time,
    )
  ) {
    throw new ValidationError(
      "Invalid event time.",
    )
  }

  return time
}

const projectTypes = [
  "starter",
  "business",
  "premium",
  "custom",
] as const

const budgetRanges = [
  "not-sure",
  "under-1k",
  "1k-3k",
  "3k-5k",
  "5k-10k",
  "10k-plus",
] as const

const timelines = [
  "not-sure",
  "asap",
  "1-2-weeks",
  "1-month",
  "2-3-months",
  "flexible",
] as const

const referralSources = [
  "google",
  "social-media",
  "referral",
  "portfolio",
  "other",
] as const

const eventTypes = [
  "wedding",
  "church-service",
  "corporate",
  "private-gathering",
  "studio-session",
  "other",
] as const

const serviceInterests = [
  "essential",
  "premium",
  "luxury",
  "accompaniment",
  "recording",
  "arrangement",
] as const

const durations = [
  "30-min",
  "1-hour",
  "2-hours",
  "3-hours",
  "4-plus-hours",
  "not-sure",
] as const

export async function POST(
  request: NextRequest,
) {
  try {
    /*
     * Reject unexpectedly large requests before
     * parsing them.
     */
    const contentLength =
      request.headers.get(
        "content-length",
      )

    if (
      contentLength &&
      Number(contentLength) >
        MAX_BODY_BYTES
    ) {
      return NextResponse.json(
        {
          error:
            "Request is too large.",
        },
        {
          status: 413,
        },
      )
    }

    const contentType =
      request.headers.get(
        "content-type",
      )

    if (
      !contentType?.includes(
        "application/json",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Content-Type must be application/json.",
        },
        {
          status: 415,
        },
      )
    }

    /*
     * Read the text ourselves so we can enforce
     * an actual size limit even if Content-Length
     * is missing or inaccurate.
     */
    const rawBody =
      await request.text()

    const bodySize =
      new TextEncoder().encode(
        rawBody,
      ).byteLength

    if (
      bodySize > MAX_BODY_BYTES
    ) {
      return NextResponse.json(
        {
          error:
            "Request is too large.",
        },
        {
          status: 413,
        },
      )
    }

    let parsedBody: unknown

    try {
      parsedBody =
        JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid JSON payload.",
        },
        {
          status: 400,
        },
      )
    }

    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        },
      )
    }

    const name = requireString(
      parsedBody.name,
      "Name",
      limits.name,
    )

    const email = normalizeEmail(
      parsedBody.email,
    )

    const message = requireString(
      parsedBody.message,
      "Message",
      limits.message,
    )

    const subject = toStringOrNull(
      parsedBody.subject,
      limits.subject,
    )

    /*
     * Build / Wyntech fields
     */
    const projectType =
      enumOrNull(
        parsedBody.projectType,
        projectTypes,
        "project type",
      )

    const hasExistingWebsite =
      existingWebsiteOrNull(
        parsedBody.hasExistingWebsite,
      )

    const budgetRange =
      enumOrNull(
        parsedBody.budgetRange,
        budgetRanges,
        "budget range",
      )

    const timeline =
      enumOrNull(
        parsedBody.timeline,
        timelines,
        "timeline",
      )

    const referralSource =
      enumOrNull(
        parsedBody.referralSource,
        referralSources,
        "referral source",
      )

    /*
     * Music / Wynora fields
     */
    const eventType =
      enumOrNull(
        parsedBody.eventType,
        eventTypes,
        "event type",
      )

    const eventDate =
      dateOrNull(
        parsedBody.eventDate,
      )

    const eventLocation =
      toStringOrNull(
        parsedBody.eventLocation,
        limits.eventLocation,
      )

    const eventStartTime =
      timeOrNull(
        parsedBody.eventStartTime,
      )

    const eventEndTime =
      timeOrNull(
        parsedBody.eventEndTime,
      )

    const serviceInterest =
      enumOrNull(
        parsedBody.serviceInterest,
        serviceInterests,
        "service",
      )

    const durationNeeded =
      enumOrNull(
        parsedBody.durationNeeded,
        durations,
        "duration",
      )

    const pianoAvailable =
      yesNoOrNotSure(
        parsedBody.pianoAvailable,
        "piano availability",
      )

    const within50Miles =
      yesNoOrNotSure(
        parsedBody.within50Miles,
        "travel distance",
      )

    const songRequests =
      toStringOrNull(
        parsedBody.songRequests,
        limits.songRequests,
      )

    const companySlug =
      toStringOrNull(
        parsedBody.companySlug,
        limits.companySlug,
      )

    const submissionType =
      toStringOrNull(
        parsedBody.submissionType,
        limits.submissionType,
      ) ?? "contact"

    /*
     * This is deliberately the server-only elevated
     * client—not the cookie-aware SSR client.
     *
     * The API route is the write boundary.
     */
    const supabase =
      createAdminClient()

    const {
      data: submission,
      error,
    } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        subject,
        message,

        company_slug:
          companySlug,

        submission_type:
          submissionType,

        status: "new",

        // Build
        project_type:
          projectType,

        has_existing_website:
          hasExistingWebsite,

        budget_range:
          budgetRange,

        timeline,

        referral_source:
          referralSource,

        // Music
        event_type:
          eventType,

        event_date:
          eventDate,

        event_location:
          eventLocation,

        event_start_time:
          eventStartTime,

        event_end_time:
          eventEndTime,

        service_interest:
          serviceInterest,

        duration_needed:
          durationNeeded,

        piano_available:
          pianoAvailable,

        within_50_miles:
          within50Miles,

        song_requests:
          songRequests,
      })
      .select("id")
      .single()

    if (error) {
      console.error(
        "[contact] Failed to save submission:",
        {
          code: error.code,
          message: error.message,
        },
      )

      return NextResponse.json(
        {
          error:
            "Failed to submit form. Please try again.",
        },
        {
          status: 500,
        },
      )
    }

    /*
     * Do not log the visitor's email/message.
     * If we need observability, the submission ID
     * is enough to locate the record internally.
     */
    console.info(
      "[contact] Submission received:",
      submission.id,
    )

    /*
     * Email notification will eventually happen here.
     *
     * Keep database persistence authoritative:
     * if notification email fails later, the submission
     * should still remain successfully stored.
     */

    return NextResponse.json(
      {
        success: true,
        message:
          "Your message has been received.",
      },
      {
        status: 201,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    )
  } catch (error) {
    if (
      error instanceof
      ValidationError
    ) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        },
      )
    }

    console.error(
      "[contact] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Internal server error.",
      },
      {
        status: 500,
      },
    )
  }
}