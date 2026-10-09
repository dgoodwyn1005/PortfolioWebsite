"use client"

import type { FormEvent } from "react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import {
  CheckCircle,
  Loader2,
  Send,
} from "lucide-react"

type ContactFormMode =
  | "general"
  | "build"
  | "music"

interface ContactFormProps {
  companySlug?: string
  submissionType?: string

  /**
   * Preferred going forward.
   *
   * Existing showOnboarding / showWynoraOnboarding
   * props remain supported for backwards compatibility.
   */
  mode?: ContactFormMode

  showSubject?: boolean
  showOnboarding?: boolean
  showWynoraOnboarding?: boolean

  buttonText?: string
  className?: string
}

const initialFormData = {
  // General
  name: "",
  email: "",
  subject: "",
  message: "",

  // Build / Wyntech
  projectType: "",
  hasExistingWebsite: "",
  budgetRange: "",
  timeline: "",
  referralSource: "",

  // Music / Wynora
  eventType: "",
  eventDate: "",
  eventLocation: "",
  eventStartTime: "",
  eventEndTime: "",
  serviceInterest: "",
  durationNeeded: "",
  pianoAvailable: "",
  within50Miles: "",
  songRequests: "",
}

type FormDataState =
  typeof initialFormData

function getServiceFromLocation() {
  if (typeof window === "undefined") {
    return null
  }

  const url = new URL(
    window.location.href,
  )

  // Preferred:
  // /wyntech?service=business#contact
  const queryService =
    url.searchParams.get("service")

  if (queryService) {
    return queryService
  }

  // Backwards compatibility:
  // /wyntech#contact?service=business
  const hash = url.hash
  const queryIndex =
    hash.indexOf("?")

  if (queryIndex === -1) {
    return null
  }

  const hashParams =
    new URLSearchParams(
      hash.slice(queryIndex + 1),
    )

  return hashParams.get("service")
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

  const [formData, setFormData] =
    useState<FormDataState>(
      initialFormData,
    )

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isSubmitted, setIsSubmitted] =
    useState(false)

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

  /*
   * Support service-prefilled links.
   *
   * New preferred format:
   * ?service=Business%20Website#contact
   *
   * Legacy hash format is also supported.
   */
  useEffect(() => {
    const checkForService = () => {
      const service =
        getServiceFromLocation()

      if (!service) {
        return
      }

      let serviceName = service

      try {
        serviceName =
          decodeURIComponent(service)
      } catch {
        // Already-decoded or malformed values
        // simply fall back to the original.
      }

      /*
       * Prefill context without writing the
       * visitor's actual message for them.
       */
      setFormData((current) => ({
        ...current,

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

      if (contactSection) {
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
          // Response was not JSON.
        }

        throw new Error(message)
      }

      setFormData(initialFormData)
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
          Thanks for reaching out. I’ll
          get back to you as soon as I
          can.
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
      onSubmit={handleSubmit}
      aria-busy={isSubmitting}
      className={[
        "space-y-6",
        className,
      ].join(" ")}
    >
      {/* General identity */}
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
            onChange={(event) =>
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
            onChange={(event) =>
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

      {showSubject && (
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
            onChange={(event) =>
              updateField(
                "subject",
                event.target.value,
              )
            }
            disabled={isSubmitting}
            className="min-h-12 text-base"
          />
        </div>
      )}

      {/* Build / Wyntech */}
      {isBuildForm && (
        <div className="space-y-8 border-y border-border/70 py-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Project
            </p>

            <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
              Tell me what you’re
              looking to build.
            </h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">
              What type of project are
              you interested in?
            </Label>

            <Select
              name="projectType"
              value={
                formData.projectType
              }
              disabled={isSubmitting}
              onValueChange={(value) =>
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
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="starter">
                  Starter Package —
                  Single-page website
                </SelectItem>

                <SelectItem value="business">
                  Business Package —
                  Multi-page website
                </SelectItem>

                <SelectItem value="premium">
                  Premium Package —
                  Full-featured web app
                </SelectItem>

                <SelectItem value="custom">
                  Custom Project —
                  Something else
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hasExistingWebsite">
              Do you have an existing
              website?
            </Label>

            <Select
              name="hasExistingWebsite"
              value={
                formData.hasExistingWebsite
              }
              disabled={isSubmitting}
              onValueChange={(value) =>
                updateField(
                  "hasExistingWebsite",
                  value,
                )
              }
            >
              <SelectTrigger
                id="hasExistingWebsite"
                className="min-h-12 text-base"
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="yes">
                  Yes, I have an existing
                  website
                </SelectItem>

                <SelectItem value="no">
                  No, starting from
                  scratch
                </SelectItem>

                <SelectItem value="redesign">
                  Yes, but I want a
                  complete redesign
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budgetRange">
                What&apos;s your budget
                range?
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
                  value,
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
                  <SelectValue placeholder="Select budget" />
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
                What&apos;s your
                timeline?
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
                  value,
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
                  <SelectValue placeholder="Select timeline" />
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

          <div className="space-y-2">
            <Label htmlFor="referralSource">
              How did you hear about
              Wyntech?
            </Label>

            <Select
              name="referralSource"
              value={
                formData.referralSource
              }
              disabled={isSubmitting}
              onValueChange={(value) =>
                updateField(
                  "referralSource",
                  value,
                )
              }
            >
              <SelectTrigger
                id="referralSource"
                className="min-h-12 text-base"
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="google">
                  Google Search
                </SelectItem>

                <SelectItem value="social-media">
                  Social Media
                </SelectItem>

                <SelectItem value="referral">
                  Friend / Colleague
                  Referral
                </SelectItem>

                <SelectItem value="portfolio">
                  Saw your portfolio work
                </SelectItem>

                <SelectItem value="other">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Music / Wynora */}
      {isMusicForm && (
        <div className="space-y-10 border-y border-border/70 py-8">
          {/* Event */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                01 / Event
              </p>

              <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                Tell me about the
                occasion.
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">
                What type of event?
              </Label>

              <Select
                name="eventType"
                value={
                  formData.eventType
                }
                disabled={
                  isSubmitting
                }
                onValueChange={(
                  value,
                ) =>
                  updateField(
                    "eventType",
                    value,
                  )
                }
              >
                <SelectTrigger
                  id="eventType"
                  className="min-h-12 text-base"
                >
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="wedding">
                    Wedding
                  </SelectItem>

                  <SelectItem value="church-service">
                    Church Service
                  </SelectItem>

                  <SelectItem value="corporate">
                    Corporate Event
                  </SelectItem>

                  <SelectItem value="private-gathering">
                    Private Gathering
                  </SelectItem>

                  <SelectItem value="studio-session">
                    Studio Session
                  </SelectItem>

                  <SelectItem value="other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventDate">
                  Event date
                </Label>

                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  autoComplete="off"
                  value={
                    formData.eventDate
                  }
                  onChange={(event) =>
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
                  Event location / venue
                </Label>

                <Input
                  id="eventLocation"
                  name="eventLocation"
                  type="text"
                  autoComplete="off"
                  placeholder="Venue and city"
                  value={
                    formData.eventLocation
                  }
                  onChange={(event) =>
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

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventStartTime">
                  Event start time
                </Label>

                <Input
                  id="eventStartTime"
                  name="eventStartTime"
                  type="time"
                  value={
                    formData.eventStartTime
                  }
                  onChange={(event) =>
                    updateField(
                      "eventStartTime",
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
                <Label htmlFor="eventEndTime">
                  Approximate end time
                </Label>

                <Input
                  id="eventEndTime"
                  name="eventEndTime"
                  type="time"
                  value={
                    formData.eventEndTime
                  }
                  onChange={(event) =>
                    updateField(
                      "eventEndTime",
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

          {/* Music */}
          <div className="space-y-5 border-t border-border/70 pt-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                02 / Music
              </p>

              <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                What do you need?
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceInterest">
                Which service are you
                interested in?
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
                  value,
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
                    Essential Performance
                    — $250
                  </SelectItem>

                  <SelectItem value="premium">
                    Premium Performance
                    — $550
                  </SelectItem>

                  <SelectItem value="luxury">
                    Luxury Session —
                    $1,000
                  </SelectItem>

                  <SelectItem value="accompaniment">
                    Piano Accompaniment
                  </SelectItem>

                  <SelectItem value="recording">
                    Audio Recording
                  </SelectItem>

                  <SelectItem value="arrangement">
                    Simple Arrangement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationNeeded">
                Approximate duration
                needed
              </Label>

              <Select
                name="durationNeeded"
                value={
                  formData.durationNeeded
                }
                disabled={
                  isSubmitting
                }
                onValueChange={(
                  value,
                ) =>
                  updateField(
                    "durationNeeded",
                    value,
                  )
                }
              >
                <SelectTrigger
                  id="durationNeeded"
                  className="min-h-12 text-base"
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="30-min">
                    30 minutes
                  </SelectItem>

                  <SelectItem value="1-hour">
                    1 hour
                  </SelectItem>

                  <SelectItem value="2-hours">
                    2 hours
                  </SelectItem>

                  <SelectItem value="3-hours">
                    3 hours
                  </SelectItem>

                  <SelectItem value="4-plus-hours">
                    4+ hours
                  </SelectItem>

                  <SelectItem value="not-sure">
                    Not sure yet
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="songRequests">
                Any specific songs or
                style requests?
              </Label>

              <Textarea
                id="songRequests"
                name="songRequests"
                autoComplete="off"
                placeholder="Songs, genres, styles, or references..."
                rows={4}
                value={
                  formData.songRequests
                }
                onChange={(event) =>
                  updateField(
                    "songRequests",
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
                className="min-h-28 resize-y text-base"
              />
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-5 border-t border-border/70 pt-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                03 / Logistics
              </p>

              <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                A few practical details.
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pianoAvailable">
                  Will a piano or keyboard
                  be available?
                </Label>

                <Select
                  name="pianoAvailable"
                  value={
                    formData.pianoAvailable
                  }
                  disabled={
                    isSubmitting
                  }
                  onValueChange={(
                    value,
                  ) =>
                    updateField(
                      "pianoAvailable",
                      value,
                    )
                  }
                >
                  <SelectTrigger
                    id="pianoAvailable"
                    className="min-h-12 text-base"
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="yes">
                      Yes
                    </SelectItem>

                    <SelectItem value="no">
                      No
                    </SelectItem>

                    <SelectItem value="not-sure">
                      Not sure
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="within50Miles">
                  Is the venue within 50
                  miles of Richmond, VA?
                </Label>

                <Select
                  name="within50Miles"
                  value={
                    formData.within50Miles
                  }
                  disabled={
                    isSubmitting
                  }
                  onValueChange={(
                    value,
                  ) =>
                    updateField(
                      "within50Miles",
                      value,
                    )
                  }
                >
                  <SelectTrigger
                    id="within50Miles"
                    className="min-h-12 text-base"
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="yes">
                      Yes
                    </SelectItem>

                    <SelectItem value="no">
                      No
                    </SelectItem>

                    <SelectItem value="not-sure">
                      Not sure
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          {isMusicForm
            ? "Anything else I should know?"
            : isBuildForm
              ? "Tell me about the project"
              : "Message"}
        </Label>

        <Textarea
          id="message"
          name="message"
          autoComplete="off"
          placeholder={
            isBuildForm
              ? "What are you trying to build, improve, or solve?"
              : isMusicForm
                ? "Anything else about the event, music, or experience I should know?"
                : "What would you like to talk about?"
          }
          rows={6}
          value={formData.message}
          onChange={(event) =>
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

      {/* Submission error */}
      {error && (
        <div
          id="contact-form-error"
          role="alert"
          aria-live="assertive"
          className="border-l-2 border-destructive pl-4"
        >
          <p className="text-sm leading-relaxed text-destructive">
            {error}
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 w-full text-base sm:w-auto sm:min-w-44"
      >
        {isSubmitting ? (
          <>
            <Loader2
              aria-hidden="true"
              className="mr-2 size-4 animate-spin"
            />
            Sending…
          </>
        ) : (
          <>
            <Send
              aria-hidden="true"
              className="mr-2 size-4"
            />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  )
}