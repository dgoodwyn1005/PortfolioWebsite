"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Lightbulb,
} from "lucide-react"

import { ResilientImage } from "@/components/resilient-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PortfolioItem {
  id: string
  title: string
  description: string
  client_name: string
  image_url: string
  project_url: string
  tags: string[]
  problem_solved?: string
  income_generated?: string
  time_to_build?: string
  technologies_used?: string[]
  key_features?: string[]
  lessons_learned?: string
  status?: string
}

interface Company {
  primary_color: string
}

function getStatusColor(status?: string) {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
    case "in_progress":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400"
    case "maintenance":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400"
    case "archived":
      return "bg-muted text-muted-foreground border-border"
    default:
      return "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
  }
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "completed":
      return "Completed"
    case "in_progress":
      return "In Progress"
    case "maintenance":
      return "Ongoing"
    case "archived":
      return "Archived"
    default:
      return "Completed"
  }
}

export function CompanyPortfolio({
  company,
  portfolio,
}: {
  company: Company
  portfolio: PortfolioItem[]
}) {
  const [selectedItem, setSelectedItem] =
    useState<PortfolioItem | null>(null)

  if (portfolio.length === 0) {
    return null
  }

  const hasDetails = (item: PortfolioItem) =>
    item.problem_solved ||
    item.income_generated ||
    item.time_to_build ||
    Boolean(
      item.technologies_used?.length,
    ) ||
    Boolean(item.key_features?.length) ||
    item.lessons_learned

  return (
    <section
      id="portfolio"
      className="border-y border-border/50 bg-muted/20 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12"
        >
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Selected client work
            </p>
          </div>

          <div className="lg:col-span-8">
            <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">
              Proof should be easier to scan than a sales pitch.
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              A few projects, the problem behind them, and what shipped.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
              }}
            >
              <Card
                className="group h-full cursor-pointer overflow-hidden rounded-[1.5rem] border-border/60 bg-card/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
                onClick={() => {
                  if (hasDetails(item)) {
                    setSelectedItem(item)
                  }
                }}
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <ResilientImage
                    sources={[item.image_url]}
                    alt={item.title}
                    loading={
                      index === 0
                        ? "eager"
                        : "lazy"
                    }
                    fetchPriority={
                      index === 0
                        ? "high"
                        : "auto"
                    }
                    fallbackTone="build"
                    fallbackLabel={item.title}
                    fallbackDetail={
                      item.client_name
                        ? `Client · ${item.client_name}`
                        : "Project preview"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${item.title}`}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-transform hover:scale-105"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>

                <CardContent className="p-5 sm:p-6">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                      {item.title}
                    </h3>

                    {item.status && (
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-[10px] ${getStatusColor(item.status)}`}
                      >
                        {getStatusLabel(
                          item.status,
                        )}
                      </Badge>
                    )}
                  </div>

                  {item.client_name && (
                    <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Client · {item.client_name}
                    </p>
                  )}

                  <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>

                  {(item.income_generated ||
                    item.time_to_build) && (
                    <div className="mb-5 flex flex-wrap gap-3 border-t border-border/50 pt-4 text-xs text-muted-foreground">
                      {item.income_generated && (
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="size-3" />
                          {item.income_generated}
                        </span>
                      )}

                      {item.time_to_build && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3" />
                          {item.time_to_build}
                        </span>
                      )}
                    </div>
                  )}

                  {item.tags?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {item.tags
                        .slice(0, 3)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  )}

                  {hasDetails(item) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full justify-between text-xs"
                      style={{
                        color:
                          company.primary_color,
                      }}
                    >
                      View case details
                      <ChevronRight className="size-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog
          open={Boolean(selectedItem)}
          onOpenChange={() =>
            setSelectedItem(null)
          }
        >
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle className="text-xl">
                        {selectedItem.title}
                      </DialogTitle>

                      {selectedItem.client_name && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          Client: {selectedItem.client_name}
                        </p>
                      )}
                    </div>

                    {selectedItem.status && (
                      <Badge
                        variant="outline"
                        className={getStatusColor(
                          selectedItem.status,
                        )}
                      >
                        {getStatusLabel(
                          selectedItem.status,
                        )}
                      </Badge>
                    )}
                  </div>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border/50 bg-muted">
                    <ResilientImage
                      sources={[
                        selectedItem.image_url,
                      ]}
                      alt={selectedItem.title}
                      loading="eager"
                      fetchPriority="high"
                      fallbackTone="build"
                      fallbackLabel={
                        selectedItem.title
                      }
                      fallbackDetail={
                        selectedItem.client_name
                          ? `Client · ${selectedItem.client_name}`
                          : "Project preview"
                      }
                      className="object-cover"
                    />
                  </div>

                  <p className="leading-relaxed text-muted-foreground">
                    {selectedItem.description}
                  </p>

                  {(selectedItem.income_generated ||
                    selectedItem.time_to_build) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.income_generated && (
                        <div className="rounded-xl border bg-muted/40 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="size-4" />
                            Income Generated
                          </div>
                          <p
                            className="text-lg font-semibold"
                            style={{
                              color:
                                company.primary_color,
                            }}
                          >
                            {selectedItem.income_generated}
                          </p>
                        </div>
                      )}

                      {selectedItem.time_to_build && (
                        <div className="rounded-xl border bg-muted/40 p-4">
                          <div className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-4" />
                            Time to Build
                          </div>
                          <p
                            className="text-lg font-semibold"
                            style={{
                              color:
                                company.primary_color,
                            }}
                          >
                            {selectedItem.time_to_build}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedItem.problem_solved && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 font-medium">
                        <Lightbulb
                          className="size-4"
                          style={{
                            color:
                              company.primary_color,
                          }}
                        />
                        Problem Solved
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {selectedItem.problem_solved}
                      </p>
                    </div>
                  )}

                  {selectedItem.key_features &&
                    selectedItem.key_features.length > 0 && (
                      <div>
                        <h4 className="mb-2 flex items-center gap-2 font-medium">
                          <CheckCircle
                            className="size-4"
                            style={{
                              color:
                                company.primary_color,
                            }}
                          />
                          Key Features
                        </h4>
                        <ul className="space-y-1.5">
                          {selectedItem.key_features.map(
                            (feature) => (
                              <li
                                key={feature}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span
                                  style={{
                                    color:
                                      company.primary_color,
                                  }}
                                >
                                  •
                                </span>
                                {feature}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {selectedItem.technologies_used &&
                    selectedItem.technologies_used.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-medium">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.technologies_used.map(
                            (tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                              >
                                {tech}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {selectedItem.lessons_learned && (
                    <div>
                      <h4 className="mb-2 font-medium">
                        Lessons Learned
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {selectedItem.lessons_learned}
                      </p>
                    </div>
                  )}

                  {selectedItem.tags?.length > 0 && (
                    <div>
                      <h4 className="mb-2 font-medium">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map(
                          (tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                            >
                              {tag}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {selectedItem.project_url && (
                    <a
                      href={selectedItem.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor:
                          company.primary_color,
                      }}
                    >
                      <ExternalLink className="size-4" />
                      View Project
                    </a>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
