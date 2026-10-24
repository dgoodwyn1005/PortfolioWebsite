"use client"

import type {
  FormEvent,
} from "react"
import {
  useEffect,
  useState,
} from "react"

import {
  CheckCircle,
  Loader2,
  Send,
} from "lucide-react"

import {
  Button,
} from "@/components/ui/button"
import {
  Input,
} from "@/components/ui/input"
import {
  Label,
} from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Textarea,
} from "@/components/ui/textarea"

type ContactFormMode =
  | "general"
  | "build"
  | "music"

interface ContactFormProps {
  companySlug?: string
  submissionType?: string

  mode?: ContactFormMode

  showSubject?: boolean
  showOnboarding?: boolean
  showWynoraOnboarding?: boolean

  buttonText?: string
  className?: string
}

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",

  selectedService: "",

  // Lightweight anti-bot honeypot.
  website: "",

  // Build
  projectType: "",
  budgetRange: "",
  timeline: "",

  // Music
  serviceInterest: "",
  eventDate: "",
  eventLocation: "",
}

type FormDataState =
  typeof initialFormData

function getServiceFromLocation() {
  if (
    typeof window === "undefined"
  ) {
    return null
  }

  const url = new URL(
    window.location.href,
  )

  const queryService =
    url.searchParams.get("service")

  if (queryService) {
    return queryService
  }

  // Backwards compatibility for old
  // #contact?service=... links.
  const queryIndex =
    url.hash.indexOf("?")

  if (queryIndex === -1) {
    return null
  }

  return new URLSearchParams(
    url.hash.slice(queryIndex + 1),
  ).get("service")
}

function decodeService(
  value: string,
) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function ContactForm({
  companySlug,
  submissionType = "contact",

  mode,

  showSubject = true,
  showOnboarding = false,
  showWynoraOnboarding = false,

  buttonText = "Send Message",
  className = "",
}: ContactFormProps) {
  const resolvedMode: ContactFormMode =
    mode ??
    (showWynoraOnboarding
      ? "music"
      : showOnboarding
        ? "build"
        : "general")

  const isBuildForm =
    resolvedMode === "build"

  const isMusicForm =
    resolvedMode === "music"

  const isGeneralForm =
    resolvedMode === "general"

  const [formData, setFormData] =
    useState<FormDataState>(
      initialFormData,
    )

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    isSubmitted,
    setIsSubmitted,
  ] = useState(false)

  const [error, setError] =
    useState("")

  function updateField<
    K extends keyof FormDataState,
  >(
    field: K,
    value: FormDataState[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  useEffect(() => {
    const checkForService = () => {
      const rawService =
        getServiceFromLocation()

      if (!rawService) {
        return
      }

      const serviceName =
        decodeService(rawService)

      setFormData((current) => ({
        ...current,

        selectedService:
          serviceName,

        subject:
          current.subject ||
          `Inquiry: ${serviceName}`,
      }))

      const contactSection =
        document.getElementById(
          "contact-form",
        ) ??
        document.getElementById(
          "contact",
        )

      if (!contactSection) {
        return
      }

      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches

      requestAnimationFrame(() => {
        contactSection.scrollIntoView({
          behavior: reduceMotion
            ? "auto"
            : "smooth",

          block: "start",
        })
      })
    }

    checkForService()

    window.addEventListener(
      "hashchange",
      checkForService,
    )

    window.addEventListener(
      "popstate",
      checkForService,
    )

    return () => {
      window.removeEventListener(
        "hashchange",
        checkForService,
      )

      window.removeEventListener(
        "popstate",
        checkForService,
      )
    }
  }, [])

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    const inferredSubject =
      formData.subject ||
      (formData.selectedService
        ? `Inquiry: ${formData.selectedService}`
        : isBuildForm
          ? "Wyntech project inquiry"
          : isMusicForm
            ? "Wynora booking inquiry"
            : "")

    try {
      const response = await fetch(
        "/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...formData,
            subject:
              inferredSubject,
            companySlug,
            submissionType,
          }),
        },
      )

      if (!response.ok) {
        let message =
          "Failed to send message. Please try again."

        try {
          const body =
            await response.json()

          if (
            typeof body?.error ===
              "string" &&
            body.error.trim()
          ) {
            message = body.error
          } else if (
            typeof body?.message ===
              "string" &&
            body.message.trim()
          ) {
            message = body.message
          }
        } catch {
          // Non-JSON response.
        }

        throw new Error(message)
      }

      setFormData(
        initialFormData,
      )

      setIsSubmitted(true)
    } catch (error) {
      console.error(
        "[contact-form] Submission failed:",
        error,
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={[
          "flex min-h-72 flex-col items-start justify-center py-8",
          className,
        ].join(" ")}
      >
        <CheckCircle
          aria-hidden="true"
          className="mb-6 size-10 text-foreground"
        />

        <h3 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Message sent.
        </h3>

        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
          Thanks for reaching out.
          Your request was received
          and I’ll review the details
          before following up.
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsSubmitted(false)
            setError("")
          }}
          className="mt-8 min-h-12 px-5"
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className={[
        "space-y-6",
        className,
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <Label htmlFor="website">
          Website
        </Label>

        <Input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(event: { target: { value: string } }) =>
            updateField(
              "website",
              event.target.value,
            )
          }
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name
          </Label>

          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(event: { target: { value: string } }) =>
              updateField(
                "name",
                event.target.value,
              )
            }
            required
            disabled={isSubmitting}
            className="min-h-12 text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email
          </Label>

          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(event: { target: { value: string } }) =>
              updateField(
                "email",
                event.target.value,
              )
            }
            required
            disabled={isSubmitting}
            className="min-h-12 text-base"
          />
        </div>
      </div>

      {isGeneralForm &&
        showSubject && (
          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject
            </Label>

            <Input
              id="subject"
              name="subject"
              type="text"
              autoComplete="off"
              placeholder="What's this about?"
              value={formData.subject}
              onChange={(event: { target: { value: string } }) =>
                updateField(
                  "subject",
                  event.target.value,
                )
              }
              disabled={
                isSubmitting
              }
              className="min-h-12 text-base"
            />
          </div>
        )}

      {(isBuildForm ||
        isMusicForm) &&
        formData.selectedService && (
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Selected service
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-base font-medium text-foreground">
                {
                  formData.selectedService
                }
              </p>

              <button
                type="button"
                onClick={() =>
                  setFormData(
                    (current) => ({
                      ...current,
                      selectedService:
                        "",
                      subject: "",
                    }),
                  )
                }
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Change
              </button>
            </div>
          </div>
        )}

      {isBuildForm && (
        <div className="space-y-6 border-y border-border/70 py-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Project
            </p>

            <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
              What do you want to
              build?
            </h3>
          </div>

          {!formData.selectedService && (
            <div className="space-y-2">
              <Label htmlFor="projectType">
                Project type
              </Label>

              <Select
                name="projectType"
                value={
                  formData.projectType
                }
                disabled={
                  isSubmitting
                }
                onValueChange={(
                  value: string,
                ) =>
                  updateField(
                    "projectType",
                    value,
                  )
                }
              >
                <SelectTrigger
                  id="projectType"
                  className="min-h-12 text-base"
                >
                  <SelectValue placeholder="Select the closest fit" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="starter">
                    Website
                  </SelectItem>

                  <SelectItem value="business">
                    Business /
                    E-commerce
                  </SelectItem>

                  <SelectItem value="premium">
                    Software / Web
                    application
                  </SelectItem>

                  <SelectItem value="custom">
                    Automation or
                    something custom
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budgetRange">
                Budget
              </Label>

              <Select
                name="budgetRange"
                value={
                  formData.budgetRange
                }
                disabled={
                  isSubmitting
                }
                onValueChange={(
                  value: string,
                ) =>
                  updateField(
                    "budgetRange",
                    value,
                  )
                }
              >
                <SelectTrigger
                  id="budgetRange"
                  className="min-h-12 text-base"
                >
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="not-sure">
                    Not sure yet
                  </SelectItem>

                  <SelectItem value="under-1k">
                    Under $1,000
                  </SelectItem>

                  <SelectItem value="1k-3k">
                    $1,000 – $3,000
                  </SelectItem>

                  <SelectItem value="3k-5k">
                    $3,000 – $5,000
                  </SelectItem>

                  <SelectItem value="5k-10k">
                    $5,000 – $10,000
                  </SelectItem>

                  <SelectItem value="10k-plus">
                    $10,000+
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">
                Timeline
              </Label>

              <Select
                name="timeline"
                value={
                  formData.timeline
                }
                disabled={
                  isSubmitting
                }
                onValueChange={(
                  value: string,
                ) =>
                  updateField(
                    "timeline",
                    value,
                  )
                }
              >
                <SelectTrigger
                  id="timeline"
                  className="min-h-12 text-base"
                >
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="not-sure">
                    Not sure yet
                  </SelectItem>

                  <SelectItem value="asap">
                    ASAP / Urgent
                  </SelectItem>

                  <SelectItem value="1-2-weeks">
                    1–2 weeks
                  </SelectItem>

                  <SelectItem value="1-month">
                    Within a month
                  </SelectItem>

                  <SelectItem value="2-3-months">
                    2–3 months
                  </SelectItem>

                  <SelectItem value="flexible">
                    Flexible / No rush
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {isMusicForm && (
        <div className="space-y-6 border-y border-border/70 py-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Booking
            </p>

            <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
              Tell me about the
              occasion.
            </h3>
          </div>

          {!formData.selectedService && (
            <div className="space-y-2">
              <Label htmlFor="serviceInterest">
                Service
              </Label>

              <Select
                name="serviceInterest"
                value={
                  formData.serviceInterest
                }
                disabled={
                  isSubmitting
                }
                onValueChange={(
                  value: string,
                ) =>
                  updateField(
                    "serviceInterest",
                    value,
                  )
                }
              >
                <SelectTrigger
                  id="serviceInterest"
                  className="min-h-12 text-base"
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="essential">
                    Live Performance
                    (Essential)
                  </SelectItem>

                  <SelectItem value="premium">
                    Live Performance
                    (Premium)
                  </SelectItem>

                  <SelectItem value="luxury">
                    Luxury Session
                  </SelectItem>

                  <SelectItem value="accompaniment">
                    Piano Accompaniment
                  </SelectItem>

                  <SelectItem value="recording">
                    Audio-Only Recording
                  </SelectItem>

                  <SelectItem value="arrangement">
                    Simple Arrangement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate">
                Event date
                <span className="ml-1 text-muted-foreground">
                  (if known)
                </span>
              </Label>

              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={
                  formData.eventDate
                }
                onChange={(event: { target: { value: string } }) =>
                  updateField(
                    "eventDate",
                    event.target.value,
                  )
                }
                disabled={
                  isSubmitting
                }
                className="min-h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLocation">
                Location
                <span className="ml-1 text-muted-foreground">
                  (if known)
                </span>
              </Label>

              <Input
                id="eventLocation"
                name="eventLocation"
                type="text"
                placeholder="Venue and city"
                value={
                  formData.eventLocation
                }
                onChange={(event: { target: { value: string } }) =>
                  updateField(
                    "eventLocation",
                    event.target.value,
                  )
                }
                disabled={
                  isSubmitting
                }
                className="min-h-12 text-base"
              />
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">
          {isBuildForm
            ? "What do you want to build?"
            : isMusicForm
              ? "Tell me about the event or music you need."
              : "Message"}
        </Label>

        <Textarea
          id="message"
          name="message"
          placeholder={
            isBuildForm
              ? "A short description is enough to start."
              : isMusicForm
                ? "Share the important details. We can work out the rest after I review it."
                : "How can I help?"
          }
          value={formData.message}
          onChange={(event: { target: { value: string } }) =>
            updateField(
              "message",
              event.target.value,
            )
          }
          required
          disabled={isSubmitting}
          className="min-h-36 resize-y text-base"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 w-full gap-2 sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin"
            />
            Sending…
          </>
        ) : (
          <>
            <Send
              aria-hidden="true"
              className="size-4"
            />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  )
}
