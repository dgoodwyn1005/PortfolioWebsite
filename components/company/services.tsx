"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Check, Code, Palette, Smartphone, Server, Megaphone, PenTool } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Service {
  id: string
  title: string
  description: string
  price: string
  features: string[]
  is_featured: boolean
}

interface Company {
  name: string
  primary_color: string
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Web Development": Code,
  "Mobile Apps": Smartphone,
  "API Development": Server,
  "Brand Identity": PenTool,
  "UI/UX Design": Palette,
  "Digital Marketing": Megaphone,
}

export function CompanyServices({ company, services }: { company: Company; services: Service[] }) {
  return (
    <section id="services" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Comprehensive solutions tailored to your needs</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.title] || Code
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`h-full relative overflow-hidden ${service.is_featured ? "border-2" : ""}`}
                  style={service.is_featured ? { borderColor: company.primary_color } : {}}
                >
                  {service.is_featured && (
                    <Badge
                      className="absolute top-4 right-4 text-white"
                      style={{ backgroundColor: company.primary_color }}
                    >
                      Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${company.primary_color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: company.primary_color }} />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground mb-4">{service.price}</p>
                    <ul className="space-y-2 mb-6">
                      {service.features?.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4" style={{ color: company.primary_color }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full text-white" 
                      style={{ backgroundColor: company.primary_color }} 
                      asChild
                    >
                      <a href={`#contact?service=${encodeURIComponent(service.title)}`}>Get Quote</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
