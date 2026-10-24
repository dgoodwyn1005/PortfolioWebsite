"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Mail,
  RefreshCw,
  Search,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

const PAGE_SIZE = 25

const leadStatuses = ["new", "contacted", "qualified", "won", "lost", "archived"] as const

type LeadStatus = (typeof leadStatuses)[number]

interface Submission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  company_slug: string | null
  submission_type: string
  selected_service: string | null
  status: string
  created_at: string
  updated_at: string | null
  owner_notification_status: string | null
  acknowledgement_status: string | null
  project_type: string | null
  budget_range: string | null
  timeline: string | null
  event_type: string | null
  event_date: string | null
  event_location: string | null
}

function displayValue(value: string | null | undefined) {
  if (!value) return null
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusClass(status: string) {
  switch (status) {
    case "new":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600"
    case "contacted":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600"
    case "qualified":
      return "border-violet-500/20 bg-violet-500/10 text-violet-600"
    case "won":
      return "border-green-500/20 bg-green-500/10 text-green-600"
    case "lost":
      return "border-red-500/20 bg-red-500/10 text-red-600"
    default:
      return "border-border bg-muted text-muted-foreground"
  }
}

function notificationClass(status: string | null) {
  if (status === "sent") return "text-green-600"
  if (status === "failed" || status === "skipped") return "text-red-600"
  return "text-muted-foreground"
}

export function SubmissionsManager() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [stageCounts, setStageCounts] = useState<Record<string, number>>({})

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(0)
  }, [statusFilter, companyFilter, debouncedSearch])

  const fetchPipelineCounts = useCallback(async () => {
    const supabase = createClient()
    const results = await Promise.all(
      leadStatuses.map((status) =>
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", status),
      ),
    )

    const counts = Object.fromEntries(
      leadStatuses.map((status, index) => [status, results[index].count ?? 0]),
    )
    setStageCounts(counts)
  }, [])

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true)
    const supabase = createClient()

    let query = supabase
      .from("contact_submissions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    if (companyFilter === "general") {
      query = query.is("company_slug", null)
    } else if (companyFilter !== "all") {
      query = query.eq("company_slug", companyFilter)
    }

    if (debouncedSearch) {
      const safeSearch = debouncedSearch.replace(/[,%()]/g, " ").trim()
      if (safeSearch) {
        query = query.or(
          `name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,selected_service.ilike.%${safeSearch}%,subject.ilike.%${safeSearch}%`,
        )
      }
    }

    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error("Error fetching submissions:", error)
    } else {
      setSubmissions((data ?? []) as Submission[])
      setTotal(count ?? 0)
    }

    setIsLoading(false)
  }, [companyFilter, debouncedSearch, page, statusFilter])

  useEffect(() => {
    void fetchSubmissions()
  }, [fetchSubmissions])

  useEffect(() => {
    void fetchPipelineCounts()
  }, [fetchPipelineCounts])

  const updateStatus = async (id: string, status: LeadStatus) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (!error) {
      setSubmissions((previous) =>
        previous.map((submission) =>
          submission.id === id ? { ...submission, status } : submission,
        ),
      )
      void fetchPipelineCounts()
    }
  }

  const visibleRange = useMemo(() => {
    if (total === 0) return "0"
    const start = page * PAGE_SIZE + 1
    const end = Math.min(total, start + submissions.length - 1)
    return `${start}–${end}`
  }, [page, submissions.length, total])

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {leadStatuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm ${
              statusFilter === status ? "border-foreground/30 bg-foreground text-background" : "border-border/70 bg-card"
            }`}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${statusFilter === status ? "text-background/60" : "text-muted-foreground"}`}>
              {displayValue(status)}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{stageCounts[status] ?? 0}</p>
          </button>
        ))}
      </div>

      <div className="rounded-[1.25rem] border border-border/70 bg-card p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <label className="relative min-w-0 flex-1 sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, service, or subject"
                className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </label>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stages</SelectItem>
                {leadStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {displayValue(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="wyntech">Wyntech</SelectItem>
                <SelectItem value="wynora">Wynora</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-3 xl:justify-end">
            <p className="text-xs text-muted-foreground">
              {visibleRange} of {total}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void fetchSubmissions()
                void fetchPipelineCounts()
              }}
            >
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-[1.5rem] border border-border/70 bg-card py-16">
          <Loader2 className="size-7 animate-spin text-primary" />
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <Mail className="mx-auto mb-4 size-10 text-muted-foreground" />
            <p className="font-medium">No leads in this view.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another stage, source, or search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => {
            const details = [
              ["Service", submission.selected_service],
              ["Budget", displayValue(submission.budget_range)],
              ["Timeline", displayValue(submission.timeline)],
              ["Project", displayValue(submission.project_type)],
              ["Event", displayValue(submission.event_type)],
              ["Event date", submission.event_date],
              ["Location", submission.event_location],
              ["Customer acknowledgement", displayValue(submission.acknowledgement_status)],
            ].filter((item): item is [string, string] => Boolean(item[1]))

            const replySubject = encodeURIComponent(
              submission.subject ? `Re: ${submission.subject}` : "Following up on your inquiry",
            )
            const mailto = `mailto:${submission.email}?subject=${replySubject}`
            const notificationIssue = ["failed", "skipped"].includes(
              submission.owner_notification_status ?? "",
            )

            return (
              <Card key={submission.id} className="overflow-hidden border-border/70">
                <CardHeader className="border-b border-border/60 bg-muted/10 pb-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg tracking-[-0.02em]">{submission.name}</CardTitle>
                        <Badge variant="outline" className={statusClass(submission.status)}>
                          {displayValue(submission.status)}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {submission.company_slug || "general"}
                        </Badge>
                        {notificationIssue && (
                          <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-red-600">
                            <AlertTriangle className="mr-1 size-3" />
                            Email {submission.owner_notification_status}
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="flex flex-wrap items-center gap-2">
                        <a href={mailto} className="flex items-center gap-1 hover:underline">
                          {submission.email}
                          <ExternalLink className="size-3" />
                        </a>
                        <span aria-hidden="true">•</span>
                        <span>
                          {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                        </span>
                        {submission.owner_notification_status && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span className={`inline-flex items-center gap-1 ${notificationClass(submission.owner_notification_status)}`}>
                              {submission.owner_notification_status === "sent" && <CheckCircle2 className="size-3" />}
                              Owner alert {submission.owner_notification_status}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={mailto}>
                          <Mail className="mr-2 size-4" />
                          Reply
                        </a>
                      </Button>

                      <Select
                        value={submission.status}
                        onValueChange={(value: LeadStatus) => void updateStatus(submission.id, value)}
                      >
                        <SelectTrigger className="h-9 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {leadStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {displayValue(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {submission.status !== "archived" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => void updateStatus(submission.id, "archived")}
                        >
                          <Archive className="mr-2 size-4" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 p-5 sm:p-6">
                  {details.length > 0 && (
                    <dl className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {details.map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {label}
                          </dt>
                          <dd className="mt-1 text-sm text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {submission.subject && <p className="font-medium text-foreground">{submission.subject}</p>}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {submission.message}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Page {page + 1} of {totalPages} · History is preserved by archiving instead of deleting.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0 || isLoading}
            onClick={() => setPage((current) => Math.max(0, current - 1))}
          >
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
