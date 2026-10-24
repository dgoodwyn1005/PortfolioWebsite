import {
  type NextRequest,
  NextResponse,
} from "next/server"

import {
  createAdminClient,
} from "@/lib/supabase/server"

import {
  sendLeadNotifications,
} from "@/lib/lead-notifications"

const MAX_BODY_BYTES = 25_000

const limits = {
  name: 120,
  email: 254,
  subject: 200,
  message: 5_000,

  companySlug: 100,
  submissionType: 100,
  selectedService: 160,

  eventLocation: 300,
  songRequests: 2_000,

  honeypot: 200,
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
    `${date}T00:00:00Z`,
  )

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
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

async function recordNotificationState(
  supabase: ReturnType<
    typeof createAdminClient
  >,
  id: string,
  notification: {
    owner:
      | "sent"
      | "skipped"
      | "failed"
      | "disabled"
    acknowledgement:
      | "sent"
      | "skipped"
      | "failed"
      | "disabled"
  },
) {
  const attemptedAt =
    new Date().toISOString()

  const {
    error,
  } = await supabase
    .from("contact_submissions")
    .update({
      owner_notification_status:
        notification.owner,

      owner_notification_attempted_at:
        attemptedAt,

      acknowledgement_status:
        notification.acknowledgement,

      acknowledgement_attempted_at:
        notification.acknowledgement ===
        "disabled"
          ? null
          : attemptedAt,
    })
    .eq("id", id)

  if (error) {
    console.warn(
      "[contact] Failed to record notification state:",
      {
        id,
        code: error.code,
      },
    )
  }
}

const successResponse = () =>
  NextResponse.json(
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

export async function POST(
  request: NextRequest,
) {
  try {
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

    /*
     * Honeypot. Real visitors never see or fill
     * this field. Bots receive a normal success
     * response so the endpoint does not teach
     * them which check they tripped.
     */
    const website = toStringOrNull(
      parsedBody.website,
      limits.honeypot,
    )

    if (website) {
      return successResponse()
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

    const selectedService =
      toStringOrNull(
        parsedBody.selectedService,
        limits.selectedService,
      )

    // Build / Wyntech
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

    // Music / Wynora
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

    const supabase =
      createAdminClient()

    /*
     * Keep duplicate retries from creating a
     * pile of identical leads. If the original
     * notification failed, retrying with the same
     * submission id is safe because the email
     * provider receives an idempotency key.
     */
    const duplicateSince =
      new Date(
        Date.now() -
          10 * 60 * 1000,
      ).toISOString()

    const {
      data: duplicate,
      error: duplicateError,
    } = await supabase
      .from("contact_submissions")
      .select("id")
      .eq("email", email)
      .eq("message", message)
      .gte(
        "created_at",
        duplicateSince,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(1)
      .maybeSingle()

    if (duplicateError) {
      console.warn(
        "[contact] Duplicate check failed:",
        {
          code:
            duplicateError.code,
        },
      )
    }

    if (duplicate) {
      try {
        const notification =
          await sendLeadNotifications({
            id: duplicate.id,
            name,
            email,
            subject,
            message,
            companySlug,
            submissionType,
            selectedService,
            budgetRange,
            timeline,
            eventDate,
            eventLocation,
          })

        await recordNotificationState(
          supabase,
          duplicate.id,
          notification,
        )

        console.info(
          "[contact] Duplicate submission reused:",
          {
            id: duplicate.id,
            notification:
              notification.owner,
          },
        )
      } catch (error) {
        console.error("[contact] Duplicate notification failed:",
          error instanceof Error ? error.message : "Unknown error")
      }
      return successResponse()
    }

    /*
     * Lightweight per-email abuse guard. This is
     * deliberately generous; the goal is to stop
     * obvious bursts without annoying legitimate
     * visitors.
     */
    const rateLimitSince =
      new Date(
        Date.now() -
          15 * 60 * 1000,
      ).toISOString()

    const {
      count,
      error: countError,
    } = await supabase
      .from("contact_submissions")
      .select(
        "id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq("email", email)
      .gte(
        "created_at",
        rateLimitSince,
      )

    if (countError) {
      console.warn(
        "[contact] Rate-limit check failed:",
        {
          code: countError.code,
        },
      )
    } else if (
      typeof count === "number" &&
      count >= 4
    ) {
      return NextResponse.json(
        {
          error:
            "Too many recent submissions. Please try again later.",
        },
        {
          status: 429,
        },
      )
    }

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

        selected_service:
          selectedService,

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

    console.info(
      "[contact] Submission received:",
      submission.id,
    )

    /*
     * Persistence is authoritative. Notification
     * happens only after the lead has been saved,
     * and notification failure never changes the
     * successful customer response.
     */
    try {
      const notification =
        await sendLeadNotifications({
          id: submission.id,
          name,
          email,
          subject,
          message,
          companySlug,
          submissionType,
          selectedService,
          budgetRange,
          timeline,
          eventDate,
          eventLocation,
        })

      await recordNotificationState(
        supabase,
        submission.id,
        notification,
      )

      console.info(
        "[contact] Lead notification:",
        {
          id: submission.id,
          owner:
            notification.owner,
          acknowledgement:
            notification.acknowledgement,
        },
      )
    } catch (error) {
      // The lead is already saved. Email/provider/status-write failures must
      // never turn persistence success into a failed customer response.
      console.error("[contact] Post-persistence notification failed:",
        error instanceof Error ? error.message : "Unknown error")
    }
    return successResponse()
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
      error instanceof Error
        ? error.message
        : "Unknown error",
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
