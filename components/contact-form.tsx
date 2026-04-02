"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, CheckCircle } from "lucide-react"

interface ContactFormProps {
  companySlug?: string
  submissionType?: string
  showSubject?: boolean
  showOnboarding?: boolean
  showWynoraOnboarding?: boolean
  buttonText?: string
  className?: string
}

export function ContactForm({
  companySlug,
  submissionType = "contact",
  showSubject = true,
  showOnboarding = false,
  showWynoraOnboarding = false,
  buttonText = "Send Message",
  className = "",
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    // Wyntech fields
    projectType: "",
    hasExistingWebsite: "",
    budgetRange: "",
    timeline: "",
    referralSource: "",
    // Wynora fields
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
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Check for service parameter in URL hash when component mounts or hash changes
  useEffect(() => {
    const checkForService = () => {
      const hash = window.location.hash
      if (hash.includes("?service=")) {
        const serviceParam = hash.split("?service=")[1]
        if (serviceParam) {
          const serviceName = decodeURIComponent(serviceParam)
          setFormData(prev => ({
            ...prev,
            subject: `Quote Request: ${serviceName}`,
            message: `Hi, I'm interested in getting a quote for your "${serviceName}" service.\n\nPlease provide more details about pricing and availability.`
          }))
          // Scroll to contact section
          const contactSection = document.getElementById("contact")
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: "smooth" })
          }
        }
      }
    }
    
    checkForService()
    window.addEventListener("hashchange", checkForService)
    return () => window.removeEventListener("hashchange", checkForService)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          companySlug,
          submissionType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      setIsSubmitted(true)
      setFormData({ 
        name: "", 
        email: "", 
        subject: "", 
        message: "",
        projectType: "",
        hasExistingWebsite: "",
        budgetRange: "",
        timeline: "",
        referralSource: "",
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
      })
    } catch (err) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground mb-4">Thank you for reaching out. I'll get back to you soon.</p>
        <Button variant="outline" onClick={() => setIsSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      {showSubject && (
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="What's this about?"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
      )}

      {showOnboarding && (
        <>
          <div className="space-y-2">
            <Label htmlFor="projectType">What type of project are you interested in?</Label>
            <Select
              value={formData.projectType}
              onValueChange={(value) => setFormData({ ...formData, projectType: value })}
            >
              <SelectTrigger id="projectType">
                <SelectValue placeholder="Select a project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter Package - Single page website</SelectItem>
                <SelectItem value="business">Business Package - Multi-page website</SelectItem>
                <SelectItem value="premium">Premium Package - Full-featured web app</SelectItem>
                <SelectItem value="custom">Custom Project - Something else</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hasExistingWebsite">Do you have an existing website?</Label>
            <Select
              value={formData.hasExistingWebsite}
              onValueChange={(value) => setFormData({ ...formData, hasExistingWebsite: value })}
            >
              <SelectTrigger id="hasExistingWebsite">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, I have an existing website</SelectItem>
                <SelectItem value="no">No, starting from scratch</SelectItem>
                <SelectItem value="redesign">Yes, but I want a complete redesign</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budgetRange">What&apos;s your budget range?</Label>
              <Select
                value={formData.budgetRange}
                onValueChange={(value) => setFormData({ ...formData, budgetRange: value })}
              >
                <SelectTrigger id="budgetRange">
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-3k">$1,000 - $3,000</SelectItem>
                  <SelectItem value="3k-5k">$3,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-plus">$10,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">What&apos;s your timeline?</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData({ ...formData, timeline: value })}
              >
                <SelectTrigger id="timeline">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP / Urgent</SelectItem>
                  <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                  <SelectItem value="1-month">Within a month</SelectItem>
                  <SelectItem value="2-3-months">2-3 months</SelectItem>
                  <SelectItem value="flexible">Flexible / No rush</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralSource">How did you hear about Wyntech?</Label>
            <Select
              value={formData.referralSource}
              onValueChange={(value) => setFormData({ ...formData, referralSource: value })}
            >
              <SelectTrigger id="referralSource">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Search</SelectItem>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                <SelectItem value="portfolio">Saw your portfolio work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {showWynoraOnboarding && (
        <>
          {/* Event Basics */}
          <div className="space-y-4 border-b pb-4">
            <h4 className="font-medium text-foreground">Event Details</h4>
            
            <div className="space-y-2">
              <Label htmlFor="eventType">What type of event?</Label>
              <Select
                value={formData.eventType}
                onValueChange={(value) => setFormData({ ...formData, eventType: value })}
              >
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="church-service">Church Service</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="private-gathering">Private Gathering</SelectItem>
                  <SelectItem value="studio-session">Studio Session</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventLocation">Event Location / Venue</Label>
                <Input
                  id="eventLocation"
                  placeholder="Venue name and city"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="eventStartTime">Event Start Time</Label>
                <Input
                  id="eventStartTime"
                  type="time"
                  value={formData.eventStartTime}
                  onChange={(e) => setFormData({ ...formData, eventStartTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventEndTime">Approximate End Time</Label>
                <Input
                  id="eventEndTime"
                  type="time"
                  value={formData.eventEndTime}
                  onChange={(e) => setFormData({ ...formData, eventEndTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Service Interest */}
          <div className="space-y-4 border-b pb-4">
            <h4 className="font-medium text-foreground">Service Interest</h4>
            
            <div className="space-y-2">
              <Label htmlFor="serviceInterest">Which service are you interested in?</Label>
              <Select
                value={formData.serviceInterest}
                onValueChange={(value) => setFormData({ ...formData, serviceInterest: value })}
              >
                <SelectTrigger id="serviceInterest">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="essential">Essential Performance - $250</SelectItem>
                  <SelectItem value="premium">Premium Performance - $550</SelectItem>
                  <SelectItem value="luxury">Luxury Session - $1,000</SelectItem>
                  <SelectItem value="accompaniment">Piano Accompaniment</SelectItem>
                  <SelectItem value="recording">Audio Recording</SelectItem>
                  <SelectItem value="arrangement">Simple Arrangement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationNeeded">Approximate duration needed</Label>
              <Select
                value={formData.durationNeeded}
                onValueChange={(value) => setFormData({ ...formData, durationNeeded: value })}
              >
                <SelectTrigger id="durationNeeded">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-min">30 minutes</SelectItem>
                  <SelectItem value="1-hour">1 hour</SelectItem>
                  <SelectItem value="2-hours">2 hours</SelectItem>
                  <SelectItem value="3-hours">3 hours</SelectItem>
                  <SelectItem value="4-plus-hours">4+ hours</SelectItem>
                  <SelectItem value="not-sure">Not sure yet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logistics */}
          <div className="space-y-4 border-b pb-4">
            <h4 className="font-medium text-foreground">Logistics</h4>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pianoAvailable">Will a piano/keyboard be available at the venue?</Label>
                <Select
                  value={formData.pianoAvailable}
                  onValueChange={(value) => setFormData({ ...formData, pianoAvailable: value })}
                >
                  <SelectTrigger id="pianoAvailable">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="not-sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="within50Miles">Is the venue within 50 miles of Richmond, VA?</Label>
                <Select
                  value={formData.within50Miles}
                  onValueChange={(value) => setFormData({ ...formData, within50Miles: value })}
                >
                  <SelectTrigger id="within50Miles">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="not-sure">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Song Requests */}
          <div className="space-y-2">
            <Label htmlFor="songRequests">Any specific songs or style requests?</Label>
            <Textarea
              id="songRequests"
              placeholder="List any specific songs, genres, or styles you'd like..."
              rows={3}
              value={formData.songRequests}
              onChange={(e) => setFormData({ ...formData, songRequests: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">{showWynoraOnboarding ? "Anything else I should know?" : "Message"}</Label>
        <Textarea
          id="message"
          placeholder="Tell me about your project or inquiry..."
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
    </form>
  )
}
