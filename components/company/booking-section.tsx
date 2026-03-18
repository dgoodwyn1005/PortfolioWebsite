"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BookingSectionProps {
  companyName: string
  primaryColor: string
  schedulingUrl?: string
}

export function BookingSection({ companyName, primaryColor, schedulingUrl }: BookingSectionProps) {
  if (!schedulingUrl) return null

  const handleScheduleClick = () => {
    window.open(schedulingUrl, "_blank", "noopener,noreferrer")
  }

  const benefits = [
    "Discuss your project requirements",
    "Get a custom quote tailored to your needs",
    "Learn about our process and timeline",
    "No obligation, completely free"
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Book a free 15-minute discovery call to discuss your project and see how {companyName} can help bring your vision to life.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2" style={{ borderColor: `${primaryColor}30` }}>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Left side - Benefits */}
                <div className="p-8 bg-muted/30">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="h-5 w-5" style={{ color: primaryColor }} />
                    <span className="font-semibold">15-Minute Discovery Call</span>
                  </div>
                  
                  <ul className="space-y-4">
                    {benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle 
                          className="h-5 w-5 mt-0.5 flex-shrink-0" 
                          style={{ color: primaryColor }} 
                        />
                        <span className="text-muted-foreground">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Right side - CTA */}
                <div 
                  className="p-8 flex flex-col justify-center items-center text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor}15 0%, ${primaryColor}05 100%)` 
                  }}
                >
                  <Calendar 
                    className="h-16 w-16 mb-6" 
                    style={{ color: primaryColor }} 
                  />
                  <h3 className="text-xl font-bold mb-2">
                    Schedule Your Free Call
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    Pick a time that works best for you
                  </p>
                  <Button
                    onClick={handleScheduleClick}
                    size="lg"
                    className="group"
                    style={{ 
                      backgroundColor: primaryColor,
                      color: '#fff'
                    }}
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
