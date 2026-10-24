"use client"

import type React from "react"

import {
  motion,
} from "framer-motion"

import {
  Check,
  Code,
  Megaphone,
  Palette,
  PenTool,
  Server,
  Smartphone,
} from "lucide-react"

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

interface Service {
  id: string
  title: string
  description: string
  price: string
  features: string[]
  is_featured: boolean
}

interface Company {
  slug: string
  name: string
  primary_color: string
}

const iconMap: Record<
  string,
  React.ComponentType<{
    className?: string
  }>
> = {
  "Web Development": Code,
  "Mobile Apps": Smartphone,
  "API Development": Server,
  "Brand Identity": PenTool,
  "UI/UX Design": Palette,
  "Digital Marketing":
    Megaphone,
}

export function CompanyServices({
  company,
  services,
}: {
  company: Company
  services: Service[]
}) {
  const actionLabel =
    company.slug === "wynora"
      ? "Request Booking"
      : "Get Quote"

  return (
    <section
      id="services"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Services & Pricing
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground">
            Clear starting points.
            Custom work is quoted
            after scope is understood.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(
            (
              service,
              index,
            ) => {
              const Icon =
                iconMap[
                  service.title
                ] || Code

              const href =
                `/${company.slug}` +
                `?service=${encodeURIComponent(
                  service.title,
                )}` +
                "#contact"

              return (
                <motion.div
                  key={service.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                >
                  <Card
                    className={[
                      "relative h-full overflow-hidden",
                      service.is_featured
                        ? "border-2"
                        : "",
                    ].join(" ")}
                    style={
                      service.is_featured
                        ? {
                            borderColor:
                              company.primary_color,
                          }
                        : {}
                    }
                  >
                    {service.is_featured && (
                      <Badge
                        className="absolute right-4 top-4 text-white"
                        style={{
                          backgroundColor:
                            company.primary_color,
                        }}
                      >
                        Popular
                      </Badge>
                    )}

                    <CardHeader>
                      <div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor:
                            `${company.primary_color}20`,
                        }}
                      >
                        <span
                          style={{
                            color:
                              company.primary_color,
                          }}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                      </div>

                      <CardTitle>
                        {
                          service.title
                        }
                      </CardTitle>

                      <CardDescription>
                        {
                          service.description
                        }
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <p className="mb-4 text-2xl font-bold text-foreground">
                        {service.price}
                      </p>

                      <ul className="mb-6 space-y-2">
                        {service.features?.map(
                          (
                            feature,
                            i,
                          ) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0"
                                style={{
                                  color:
                                    company.primary_color,
                                }}
                              />

                              <span>
                                {
                                  feature
                                }
                              </span>
                            </li>
                          ),
                        )}
                      </ul>

                      <Button
                        className="w-full text-white"
                        style={{
                          backgroundColor:
                            company.primary_color,
                        }}
                        asChild
                      >
                        <a href={href}>
                          {
                            actionLabel
                          }
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            },
          )}
        </div>
      </div>
    </section>
  )
}
