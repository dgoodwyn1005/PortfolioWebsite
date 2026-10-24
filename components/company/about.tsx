"use client"

import { motion } from "framer-motion"
import { Target, Lightbulb } from "lucide-react"

interface Company {
  name: string
  about_text: string
  mission_text: string
  primary_color: string
}

export function CompanyAbout({ company }: { company: Company }) {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About {company.name}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${company.primary_color}20` }}
            >
              <Lightbulb className="h-6 w-6" style={{ color: company.primary_color }} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Our Story</h3>
            <p className="text-muted-foreground leading-relaxed">{company.about_text}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${company.primary_color}20` }}
            >
              <Target className="h-6 w-6" style={{ color: company.primary_color }} />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">{company.mission_text}</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
