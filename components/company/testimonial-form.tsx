"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, CheckCircle } from "lucide-react"

interface TestimonialFormProps {
  companyId: string
  companyName: string
  primaryColor: string
}

export function TestimonialForm({ companyId, companyName, primaryColor }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_role: "",
    client_company: "",
    content: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const { error: submitError } = await supabase.from("company_testimonials").insert({
        company_id: companyId,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_role: formData.client_role,
        client_company: formData.client_company,
        content: formData.content,
        rating: formData.rating,
        status: "pending",
        is_visible: false,
        display_order: 999,
      })

      if (submitError) throw submitError

      setIsSubmitted(true)
    } catch {
      setError("Failed to submit testimonial. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-muted-foreground">
            Your testimonial has been submitted and is awaiting review. We appreciate your feedback!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>
          We&apos;d love to hear about your experience with {companyName}. Your testimonial will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Your Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_email">Your Email *</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                placeholder="john@example.com"
                required
              />
              <p className="text-xs text-muted-foreground">Your email will not be displayed publicly</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_role">Your Role (Optional)</Label>
              <Input
                id="client_role"
                value={formData.client_role}
                onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                placeholder="CEO, Manager, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_company">Your Company (Optional)</Label>
              <Input
                id="client_company"
                value={formData.client_company}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  <Star
                    className="h-8 w-8 transition-colors"
                    fill={(hoveredRating || formData.rating) >= star ? primaryColor : "transparent"}
                    stroke={(hoveredRating || formData.rating) >= star ? primaryColor : "currentColor"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Testimonial *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your experience working with us..."
              rows={4}
              required
              minLength={20}
            />
            <p className="text-xs text-muted-foreground">Minimum 20 characters</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full text-white"
            style={{ backgroundColor: primaryColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
