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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash2, Star, Check, X, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  name: string
  slug: string
}

interface Testimonial {
  id: string
  company_id: string
  client_name: string
  client_role: string
  client_company: string
  client_email?: string
  content: string
  rating: number
  image_url: string
  is_visible: boolean
  display_order: number
  status: 'pending' | 'approved' | 'rejected'
  companies?: { name: string }
}

export function TestimonialsManager({
  initialTestimonials,
  companies,
}: { initialTestimonials: Testimonial[]; companies: Company[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  const filteredTestimonials = testimonials.filter((t) => {
    const companyMatch = selectedCompany === "all" || t.company_id === selectedCompany
    const statusMatch = statusFilter === "all" || t.status === statusFilter
    return companyMatch && statusMatch
  })

  const pendingCount = testimonials.filter((t) => t.status === 'pending').length

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("company_testimonials")
      .update({ status: 'approved', is_visible: true })
      .eq("id", id)

    if (!error) {
      setTestimonials(testimonials.map((t) => 
        t.id === id ? { ...t, status: 'approved' as const, is_visible: true } : t
      ))
      router.refresh()
    }
  }

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("company_testimonials")
      .update({ status: 'rejected', is_visible: false })
      .eq("id", id)

    if (!error) {
      setTestimonials(testimonials.map((t) => 
        t.id === id ? { ...t, status: 'rejected' as const, is_visible: false } : t
      ))
      router.refresh()
    }
  }

  const handleSave = async (testimonial: Partial<Testimonial>) => {
    setLoading(true)
    try {
      if (editingTestimonial?.id) {
        const { error } = await supabase
          .from("company_testimonials")
          .update(testimonial)
          .eq("id", editingTestimonial.id)

        if (!error) {
          setTestimonials(
            testimonials.map((t) => (t.id === editingTestimonial.id ? ({ ...t, ...testimonial } as Testimonial) : t)),
          )
        }
      } else {
        const { data, error } = await supabase
          .from("company_testimonials")
          .insert(testimonial)
          .select("*, companies(name)")
          .single()

        if (!error && data) {
          setTestimonials([...testimonials, data])
        }
      }
      setIsDialogOpen(false)
      setEditingTestimonial(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    const { error } = await supabase.from("company_testimonials").delete().eq("id", id)

    if (!error) {
      setTestimonials(testimonials.filter((t) => t.id !== id))
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
              <DialogDescription>
                {editingTestimonial ? "Update testimonial details" : "Add a new client testimonial"}
              </DialogDescription>
            </DialogHeader>
            <TestimonialForm
              testimonial={editingTestimonial}
              companies={companies}
              onSave={handleSave}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredTestimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{testimonial.client_name}</CardTitle>
                  <CardDescription>
                    {testimonial.client_role}
                    {testimonial.client_company ? `, ${testimonial.client_company}` : ""} |{" "}
                    {testimonial.companies?.name}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingTestimonial(testimonial)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">"{testimonial.content}"</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill={i < testimonial.rating ? "currentColor" : "transparent"} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TestimonialForm({
  testimonial,
  companies,
  onSave,
  loading,
}: {
  testimonial: Testimonial | null
  companies: Company[]
  onSave: (testimonial: Partial<Testimonial>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<Partial<Testimonial>>(
    testimonial || {
      company_id: companies[0]?.id || "",
      client_name: "",
      client_role: "",
      client_company: "",
      content: "",
      rating: 5,
      image_url: "",
      is_visible: true,
      display_order: 0,
    },
  )

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial)
    } else {
      setFormData({
        company_id: companies[0]?.id || "",
        client_name: "",
        client_role: "",
        client_company: "",
        content: "",
        rating: 5,
        image_url: "",
        is_visible: true,
        display_order: 0,
      })
    }
  }, [testimonial, companies])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Company</Label>
        <Select value={formData.company_id} onValueChange={(value) => setFormData({ ...formData, company_id: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client Name</Label>
          <Input
            value={formData.client_name || ""}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Client Role</Label>
          <Input
            value={formData.client_role || ""}
            onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
            placeholder="CEO"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Client Company</Label>
          <Input
            value={formData.client_company || ""}
            onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
            placeholder="Acme Inc."
          />
        </div>
        <div className="space-y-2">
          <Label>Rating</Label>
          <Select
            value={String(formData.rating)}
            onValueChange={(value) => setFormData({ ...formData, rating: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} Star{n > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Testimonial Content</Label>
        <Textarea
          value={formData.content || ""}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="What the client said..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Client Photo URL (optional)</Label>
        <Input
          value={formData.image_url || ""}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label>Visible on site</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : testimonial ? "Update Testimonial" : "Create Testimonial"}
      </Button>
    </form>
  )
}
