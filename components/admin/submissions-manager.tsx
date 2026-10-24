"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  formatDistanceToNow,
} from "date-fns"

import {
  ExternalLink,
  Loader2,
  Mail,
  RefreshCw,
  Trash2,
} from "lucide-react"

import {
  createClient,
} from "@/lib/supabase/client"

import {
  Badge,
} from "@/components/ui/badge"
import {
  Button,
} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "archived",
] as const

type LeadStatus =
  (typeof leadStatuses)[number]

interface Submission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string

  company_slug: string | null
  submission_type: string
  selected_service:
    | string
    | null

  status: string
  created_at: string

  owner_notification_status:
    | string
    | null

  acknowledgement_status:
    | string
    | null

  project_type:
    | string
    | null

  budget_range:
    | string
    | null

  timeline:
    | string
    | null

  event_type:
    | string
    | null

  event_date:
    | string
    | null

  event_location:
    | string
    | null
}

function displayValue(
  value:
    | string
    | null
    | undefined,
) {
  if (!value) {
    return null
  }

  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

function statusClass(
  status: string,
) {
  switch (status) {
    case "new":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"

    case "contacted":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20"

    case "qualified":
      return "bg-violet-500/10 text-violet-600 border-violet-500/20"

    case "won":
      return "bg-green-500/10 text-green-600 border-green-500/20"

    case "lost":
      return "bg-red-500/10 text-red-600 border-red-500/20"

    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function SubmissionsManager() {
  const [
    submissions,
    setSubmissions,
  ] = useState<Submission[]>(
    [],
  )

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [filter, setFilter] =
    useState("all")

  const fetchSubmissions =
    async () => {
      setIsLoading(true)

      const supabase =
        createClient()

      let query = supabase
        .from(
          "contact_submissions",
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          },
        )

      if (filter !== "all") {
        query = query.eq(
          "status",
          filter,
        )
      }

      const {
        data,
        error,
      } = await query

      if (error) {
        console.error(
          "Error fetching submissions:",
          error,
        )
      } else {
        setSubmissions(
          (data ||
            []) as Submission[],
        )
      }

      setIsLoading(false)
    }

  useEffect(() => {
    void fetchSubmissions()
  }, [filter])

  const updateStatus =
    async (
      id: string,
      status: LeadStatus,
    ) => {
      const supabase =
        createClient()

      const {
        error,
      } = await supabase
        .from(
          "contact_submissions",
        )
        .update({
          status,

          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)

      if (!error) {
        setSubmissions(
          (previous) =>
            previous.map(
              (submission) =>
                submission.id ===
                id
                  ? {
                      ...submission,
                      status,
                    }
                  : submission,
            ),
        )
      }
    }

  const deleteSubmission =
    async (id: string) => {
      if (
        !confirm(
          "Delete this submission? This cannot be undone.",
        )
      ) {
        return
      }

      const supabase =
        createClient()

      const {
        error,
      } = await supabase
        .from(
          "contact_submissions",
        )
        .delete()
        .eq("id", id)

      if (!error) {
        setSubmissions(
          (previous) =>
            previous.filter(
              (submission) =>
                submission.id !==
                id,
            ),
        )
      }
    }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={filter}
            onValueChange={
              setFilter
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All
              </SelectItem>

              {leadStatuses.map(
                (status) => (
                  <SelectItem
                    key={status}
                    value={status}
                  >
                    {
                      displayValue(
                        status,
                      )
                    }
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Badge variant="outline">
            {submissions.length}{" "}
            {submissions.length ===
            1
              ? "lead"
              : "leads"}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            void fetchSubmissions()
          }
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {submissions.length ===
      0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

            <p className="text-muted-foreground">
              No leads in this
              view.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map(
            (submission) => {
              const details = [
                [
                  "Service",
                  submission.selected_service,
                ],
                [
                  "Budget",
                  displayValue(
                    submission.budget_range,
                  ),
                ],
                [
                  "Timeline",
                  displayValue(
                    submission.timeline,
                  ),
                ],
                [
                  "Project",
                  displayValue(
                    submission.project_type,
                  ),
                ],
                [
                  "Event",
                  displayValue(
                    submission.event_type,
                  ),
                ],
                [
                  "Event date",
                  submission.event_date,
                ],
                [
                  "Location",
                  submission.event_location,
                ],
                [
                  "Owner alert",
                  displayValue(
                    submission.owner_notification_status,
                  ),
                ],
                [
                  "Customer acknowledgement",
                  displayValue(
                    submission.acknowledgement_status,
                  ),
                ],
              ].filter(
                (
                  item,
                ): item is [
                  string,
                  string,
                ] =>
                  Boolean(item[1]),
              )

              return (
                <Card
                  key={
                    submission.id
                  }
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg">
                            {
                              submission.name
                            }
                          </CardTitle>

                          <Badge
                            variant="outline"
                            className={statusClass(
                              submission.status,
                            )}
                          >
                            {
                              displayValue(
                                submission.status,
                              )
                            }
                          </Badge>

                          <Badge variant="secondary">
                            {submission.company_slug
                              ? `${submission.submission_type} · ${submission.company_slug}`
                              : submission.submission_type}
                          </Badge>
                        </div>

                        <CardDescription className="flex flex-wrap items-center gap-2">
                          <a
                            href={`mailto:${submission.email}`}
                            className="flex items-center gap-1 hover:underline"
                          >
                            {
                              submission.email
                            }

                            <ExternalLink className="h-3 w-3" />
                          </a>

                          <span
                            aria-hidden="true"
                          >
                            •
                          </span>

                          <span>
                            {formatDistanceToNow(
                              new Date(
                                submission.created_at,
                              ),
                              {
                                addSuffix:
                                  true,
                              },
                            )}
                          </span>
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={
                            submission.status
                          }
                          onValueChange={(
                            value: LeadStatus,
                          ) =>
                            void updateStatus(
                              submission.id,
                              value,
                            )
                          }
                        >
                          <SelectTrigger className="h-9 w-36">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {leadStatuses.map(
                              (
                                status,
                              ) => (
                                <SelectItem
                                  key={
                                    status
                                  }
                                  value={
                                    status
                                  }
                                >
                                  {
                                    displayValue(
                                      status,
                                    )
                                  }
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete lead from ${submission.name}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            void deleteSubmission(
                              submission.id,
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    {details.length >
                      0 && (
                      <dl className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {details.map(
                          ([
                            label,
                            value,
                          ]) => (
                            <div
                              key={
                                label
                              }
                            >
                              <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                {label}
                              </dt>

                              <dd className="mt-1 text-sm text-foreground">
                                {value}
                              </dd>
                            </div>
                          ),
                        )}
                      </dl>
                    )}

                    {submission.subject && (
                      <p className="font-medium text-foreground">
                        {
                          submission.subject
                        }
                      </p>
                    )}

                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {
                        submission.message
                      }
                    </p>
                  </CardContent>
                </Card>
              )
            },
          )}
        </div>
      )}
    </div>
  )
}
