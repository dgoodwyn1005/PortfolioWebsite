"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Pencil, Plus, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Company {
  id: string
  slug: string
  name: string
  tagline: string
  hero_title: string
  hero_subtitle: string
  about_text: string
  mission_text: string
  contact_email: string
  contact_phone: string
  primary_color: string
  scheduling_url: string
  is_active: boolean
}

export function CompaniesManager({ initialCompanies }: { initialCompanies: Company[] }) {
  const [companies, setCompanies] = useState(initialCompanies)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async (company: Partial<Company>) => {
    setLoading(true)
    try {
      if (editingCompany?.id) {
        const { error } = await supabase.from("companies").update(company).eq("id", editingCompany.id)

        if (!error) {
          setCompanies(companies.map((c) => (c.id === editingCompany.id ? ({ ...c, ...company } as Company) : c)))
        }
      } else {
        const { data, error } = await supabase.from("companies").insert(company).select().single()

        if (!error && data) {
          setCompanies([...companies, data])
        }
      }
      setIsDialogOpen(false)
      setEditingCompany(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCompany(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Edit Company" : "Add Company"}</DialogTitle>
              <DialogDescription>
                {editingCompany ? "Update company details" : "Add a new company sub-site"}
              </DialogDescription>
            </DialogHeader>
            <CompanyForm company={editingCompany} onSave={handleSave} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {companies.map((company) => (
          <Card key={company.id} className="relative">
            <div
              className="absolute top-0 left-0 right-0 h-2 rounded-t-lg"
              style={{ backgroundColor: company.primary_color }}
            />
            <CardHeader className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {company.name}
                    <Link href={`/${company.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Link>
                  </CardTitle>
                  <CardDescription>{company.tagline}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingCompany(company)
                    setIsDialogOpen(true)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Hero:</span> {company.hero_title}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Email:</span> {company.contact_email || "Not set"}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: company.primary_color }} />
                  <span className="text-xs text-muted-foreground">{company.primary_color}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function CompanyForm({
  company,
  onSave,
  loading,
}: {
  company: Company | null
  onSave: (company: Partial<Company>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<Partial<Company>>(
    company || {
      name: "",
      slug: "",
      tagline: "",
      hero_title: "",
      hero_subtitle: "",
      about_text: "",
      mission_text: "",
      contact_email: "",
      contact_phone: "",
      primary_color: "#3b82f6",
      scheduling_url: "",
      is_active: true,
    },
  )

  useEffect(() => {
    if (company) {
      setFormData(company)
    } else {
      setFormData({
        name: "",
        slug: "",
        tagline: "",
        hero_title: "",
        hero_subtitle: "",
        about_text: "",
        mission_text: "",
        contact_email: "",
        contact_phone: "",
        primary_color: "#3b82f6",
        scheduling_url: "",
        is_active: true,
      })
    }
  }, [company])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="WynTech Solutions"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>URL Slug</Label>
          <Input
            value={formData.slug || ""}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
            placeholder="wyntech"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tagline</Label>
        <Input
          value={formData.tagline || ""}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          placeholder="Building Tomorrow's Technology Today"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Hero Title</Label>
          <Input
            value={formData.hero_title || ""}
            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
            placeholder="Custom Software Solutions"
          />
        </div>
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.primary_color || "#3b82f6"}
              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              className="w-16 h-10 p-1"
            />
            <Input
              value={formData.primary_color || "#3b82f6"}
              onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
              placeholder="#3b82f6"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Hero Subtitle</Label>
        <Textarea
          value={formData.hero_subtitle || ""}
          onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
          placeholder="We transform ideas into powerful applications..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>About Text</Label>
        <Textarea
          value={formData.about_text || ""}
          onChange={(e) => setFormData({ ...formData, about_text: e.target.value })}
          placeholder="Company story and background..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Mission Statement</Label>
        <Textarea
          value={formData.mission_text || ""}
          onChange={(e) => setFormData({ ...formData, mission_text: e.target.value })}
          placeholder="Company mission and values..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Contact Email</Label>
          <Input
            type="email"
            value={formData.contact_email || ""}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="contact@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label>Contact Phone</Label>
          <Input
            value={formData.contact_phone || ""}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Scheduling URL (Calendly, Cal.com, Google Calendar, etc.)</Label>
        <Input
          value={formData.scheduling_url || ""}
          onChange={(e) => setFormData({ ...formData, scheduling_url: e.target.value })}
          placeholder="https://calendly.com/your-username or https://calendar.google.com/calendar/appointments/..."
        />
        <p className="text-xs text-muted-foreground">
          Add a booking link so customers can schedule consultations directly
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label>Company is active</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : company ? "Update Company" : "Create Company"}
      </Button>
    </form>
  )
}
