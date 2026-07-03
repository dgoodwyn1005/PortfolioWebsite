"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, Palette, ImageIcon, Upload, Link } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

interface SettingsFormProps {
  settings: Record<string, string>
}

const settingGroups = [
  {
    title: "Hero Section",
    description: "The main headline area of your portfolio",
    fields: [
      { key: "hero_title", label: "Title (Your Name)", type: "input" },
      { key: "hero_subtitle", label: "Subtitle (Roles/Titles)", type: "input" },
      { key: "hero_description", label: "Description", type: "textarea" },
      { key: "hero_background_image", label: "Background Image", type: "image" },
    ],
  },
  {
    title: "About Section",
    description: "Tell your story",
    fields: [
      { key: "about_paragraph_1", label: "Paragraph 1 (Main intro)", type: "textarea" },
      { key: "about_paragraph_2", label: "Paragraph 2", type: "textarea" },
      { key: "about_paragraph_3", label: "Paragraph 3", type: "textarea" },
      { key: "about_profile_image", label: "Profile Image", type: "image" },
      { key: "resume_url", label: "Resume/Portfolio PDF URL", type: "input" },
    ],
  },
  {
    title: "Branding",
    icon: ImageIcon,
    description: "Logo and branding assets",
    fields: [
      { key: "site_logo", label: "Site Logo", type: "image" },
      { key: "site_favicon", label: "Favicon", type: "image" },
    ],
  },
  {
    title: "Scheduling",
    icon: Link,
    description: "Allow visitors to book time with you (Google Calendar, Calendly, Cal.com, or any booking link)",
    fields: [
      {
        key: "scheduling_url",
        label: "Scheduling Link",
        type: "input",
        placeholder: "https://calendar.google.com/calendar/appointments/... or https://calendly.com/...",
      },
      { key: "scheduling_button_text", label: "Button Text", type: "input", placeholder: "Schedule a Call" },
    ],
  },
  {
    title: "Contact Section",
    description: "Contact page content",
    fields: [
      { key: "contact_heading", label: "Contact Heading", type: "input" },
      { key: "contact_description", label: "Contact Description", type: "textarea" },
    ],
  },
  {
    title: "Brand Colors",
    icon: Palette,
    description: "Customize the color scheme of your portfolio",
    fields: [
      { key: "primary_color", label: "Primary Color", type: "color" },
      { key: "secondary_color", label: "Secondary Color", type: "color" },
      { key: "accent_color", label: "Accent Color", type: "color" },
    ],
  },
]

export function SettingsForm({ settings }: SettingsFormProps) {
  const [formData, setFormData] = useState(settings)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingFields((prev) => ({ ...prev, [key]: true }))

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload failed")

      const data = await res.json()
      handleChange(key, data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image")
    } finally {
      setUploadingFields((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      for (const [key, value] of Object.entries(formData)) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })

        if (error) throw error
      }

      setMessage({ type: "success", text: "Settings saved successfully! Changes will appear on refresh." })
      router.refresh()
    } catch (err) {
      // Extract the real Supabase error message
      const actualError = err?.message || err?.error_description || JSON.stringify(err);
      
      // Force an iPad pop-up so you can't miss it
      alert(`SUPABASE ERROR: ${actualError}`);
      
      // Update the red text with the real error too
      setMessage({ type: "error", text: `Database rejected save: ${actualError}` })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {settingGroups.map((group) => {
        const GroupIcon = group.icon
        return (
          <Card key={group.title}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {GroupIcon && <GroupIcon className="h-5 w-5 text-primary" />}
                <CardTitle>{group.title}</CardTitle>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === "color" ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        id={field.key}
                        type="color"
                        value={formData[field.key] || "#14b8a6"}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={formData[field.key] || "#14b8a6"}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        placeholder="#14b8a6"
                      />
                    </div>
                  ) : field.type === "image" ? (
                    <div className="space-y-2">
                      <ImagePicker
                        value={formData[field.key] || ""}
                        onChange={(url) => handleChange(field.key, url)}
                        label="Choose from Gallery"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={formData[field.key] || ""}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          placeholder="Or enter image URL directly"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={uploadingFields[field.key]}
                          onClick={() => document.getElementById(`upload-${field.key}`)?.click()}
                        >
                          {uploadingFields[field.key] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                        </Button>
                        <input
                          id={`upload-${field.key}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(field.key, file)
                          }}
                        />
                      </div>
                      {formData[field.key] && (
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={formData[field.key] || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={(field as any).placeholder || ""}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        Save Settings
      </Button>
    </form>
  )
}
