"use client"

import { motion } from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function HeroSection() {
  const [heroData, setHeroData] = useState({
    backgroundImage: "/basketball-player-silhouette-dramatic-lighting-dar.jpg",
    title: "Deshawn Goodwyn",
    subtitle: "D2 Basketball Starter · Wyntech Founder · Gospel Pianist · Full-Stack Developer",
    description:
      "Former Virginia HS 3-point record holder (107 + 105 threes) → 4.56 GPA → Now building web apps and playing keys.",
  })

  useEffect(() => {
    const loadSettings = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("site_settings").select("key, value")
      const settings = data?.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {} as Record<string, string>
      )
      if (settings) {
        setHeroData({
          backgroundImage: settings.hero_background_image || heroData.backgroundImage,
          title: settings.hero_title || heroData.title,
          subtitle: settings.hero_subtitle || heroData.subtitle,
          description: settings.hero_description || heroData.description,
        })
      }
    }
    loadSettings()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {heroData.backgroundImage && (
          <img
            src={heroData.backgroundImage || "/placeholder.svg"}
            alt="Background"
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=1080&width=1920"
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            {heroData.title}
          </h1>
          <p className="text-primary text-sm sm:text-base font-medium tracking-widest uppercase mb-6">
            {heroData.subtitle}
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            {heroData.description}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="/wyntech"
            className="group flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors duration-200"
          >
            Explore Wyntech
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
          <a
            href="/wynora"
            className="group flex items-center gap-2 px-7 py-3 rounded-full border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-200"
          >
            Explore Wynora
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <a
            href="#about"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm">Scroll</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              <ArrowDown className="h-5 w-5" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
