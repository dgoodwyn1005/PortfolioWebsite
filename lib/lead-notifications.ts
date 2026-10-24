import "server-only"

const RESEND_EMAILS_ENDPOINT =
  "https://api.resend.com/emails"

const DEFAULT_NOTIFICATION_EMAIL =
  "contactme.dkg@gmail.com"

type LeadNotificationInput = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string

  companySlug: string | null
  submissionType: string
  selectedService: string | null

  budgetRange: string | null
  timeline: string | null

  eventDate: string | null
  eventLocation: string | null
}

type DeliveryState =
  | "sent"
  | "skipped"
  | "failed"
  | "disabled"

export type LeadNotificationResult = {
  owner: DeliveryState
  acknowledgement: DeliveryState
}

function compactLine(
  label: string,
  value: string | null | undefined,
) {
  return value
    ? `${label}: ${value}`
    : null
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.deshawngoodwyn.com"
  ).replace(/\/$/, "")
}

async function sendEmail({
  to,
  subject,
  text,
  idempotencyKey,
}: {
  to: string
  subject: string
  text: string
  idempotencyKey: string
}) {
  const apiKey =
    process.env.RESEND_API_KEY?.trim()

  const from =
    process.env.LEAD_FROM_EMAIL?.trim()

  if (!apiKey || !from) {
    return "skipped" as const
  }

  try {
    const response = await fetch(
      RESEND_EMAILS_ENDPOINT,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",

          "Idempotency-Key":
            idempotencyKey,
        },

        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
        }),

        cache: "no-store",
        signal: AbortSignal.timeout(8_000),
      },
    )

    if (!response.ok) {
      console.error(
        "[lead-email] Provider rejected email:",
        {
          status: response.status,
        },
      )

      return "failed" as const
    }

    return "sent" as const
  } catch (error) {
    console.error(
      "[lead-email] Provider request failed:",
      error instanceof Error
        ? error.message
        : "Unknown error",
    )

    return "failed" as const
  }
}

export async function sendLeadNotifications(
  lead: LeadNotificationInput,
): Promise<LeadNotificationResult> {
  const notificationEmail =
    process.env
      .LEAD_NOTIFICATION_EMAIL
      ?.trim() ||
    DEFAULT_NOTIFICATION_EMAIL

  const source =
    lead.companySlug ||
    lead.submissionType ||
    "website"

  const ownerSubject =
    `[${source}] New lead` +
    (lead.selectedService
      ? ` — ${lead.selectedService}`
      : lead.subject
        ? ` — ${lead.subject}`
        : "")

  const adminUrl =
    `${getSiteUrl()}/admin/submissions`

  const ownerBody = [
    "A new website lead was saved.",
    "",
    compactLine(
      "Submission ID",
      lead.id,
    ),
    compactLine(
      "Source",
      source,
    ),
    compactLine(
      "Type",
      lead.submissionType,
    ),
    compactLine(
      "Selected service",
      lead.selectedService,
    ),
    compactLine(
      "Name",
      lead.name,
    ),
    compactLine(
      "Email",
      lead.email,
    ),
    compactLine(
      "Subject",
      lead.subject,
    ),
    compactLine(
      "Budget",
      lead.budgetRange,
    ),
    compactLine(
      "Timeline",
      lead.timeline,
    ),
    compactLine(
      "Event date",
      lead.eventDate,
    ),
    compactLine(
      "Event location",
      lead.eventLocation,
    ),
    "",
    "Message:",
    lead.message,
    "",
    `Admin: ${adminUrl}`,
  ]
    .filter(
      (
        line,
      ): line is string =>
        line !== null,
    )
    .join("\n")

  const owner = await sendEmail({
    to: notificationEmail,
    subject: ownerSubject,
    text: ownerBody,
    idempotencyKey:
      `lead-owner/${lead.id}`,
  })

  let acknowledgement:
    DeliveryState = "disabled"

  if (
    process.env
      .LEAD_ACK_EMAILS_ENABLED ===
    "true"
  ) {
    const customerSubject =
      "Your request was received"

    const customerBody = [
      `Hi ${lead.name},`,
      "",
      "Thanks for reaching out. I received your request and will review the details before following up.",
      "",
      lead.selectedService
        ? `Request: ${lead.selectedService}`
        : null,
      "",
      "— Deshawn Goodwyn",
    ]
      .filter(
        (
          line,
        ): line is string =>
          line !== null,
      )
      .join("\n")

    acknowledgement =
      await sendEmail({
        to: lead.email,
        subject: customerSubject,
        text: customerBody,
        idempotencyKey:
          `lead-ack/${lead.id}`,
      })
  }

  return {
    owner,
    acknowledgement,
  }
}
