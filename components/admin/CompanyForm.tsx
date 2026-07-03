"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2, Upload } from "lucide-react"
import { ImagePicker } from "@/components/admin/image-picker"

// Define the shape of your company data based on your database
interface CompanyData {
  id: string
  name: string
  slug: string
  description: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_background_image: string | null
}

export function CompanyForm({ company }: { company: CompanyData }) {
  const [formData, setFormData] = useState<CompanyData>(company)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleChange = (key: keyof CompanyData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      // The crucial difference: updating a specific row in the companies table
      const { error } = await supabase
        .from("companies")
        .update({
          name: formData.name,
          description: formData.description,
          hero_title: formData.hero_title,
          hero_subtitle: formData.hero_subtitle,
          hero_background_image: formData.hero_background_image,
        })
        .eq("id", company.id) // Only update this specific company

      if (error) throw error

      setMessage({ type: "success", text: `${formData.name} updated successfully!` })
      router.refresh()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update company" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit {company.name} Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input 
                id="name" 
                value={formData.name || ""} 
                onChange={(e) => handleChange("name", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_title">Hero Title</Label>
              <Input 
                id="hero_title" 
                value={formData.hero_title || ""} 
                onChange={(e) => handleChange("hero_title", e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea 
              id="description" 
              value={formData.description || ""} 
              onChange={(e) => handleChange("description", e.target.value)} 
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Hero Background Image URL</Label>
            <div className="flex gap-2">
              <Input 
                value={formData.hero_background_image || ""} 
                onChange={(e) => handleChange("hero_background_image", e.target.value)} 
                placeholder="/wynora-bg.jpg or https://..."
              />
            </div>
            {formData.hero_background_image && (
              <img 
                src={formData.hero_background_image} 
                alt="Background Preview" 
                className="mt-2 w-full h-32 object-cover rounded-md border"
              />
            )}
          </div>

        </CardContent>
      </Card>

      {message && (
        <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-destructive"}`}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        Save {company.name}
      </Button>
    </form>
  )
}
