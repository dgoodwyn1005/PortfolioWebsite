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
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  name: string
  slug: string
  primary_color: string
}

interface Service {
  id: string
  company_id: string
  title: string
  description: string
  price: string
  features: string[]
  is_featured: boolean
  is_visible: boolean
  display_order: number
  companies?: { name: string; slug: string }
}

export function ServicesManager({ initialServices, companies }: { initialServices: Service[]; companies: Company[] }) {
  const [services, setServices] = useState(initialServices)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  // Real-time subscription for service updates
  useEffect(() => {
    const channel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'company_services',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the full service with company data
            const { data } = await supabase
              .from('company_services')
              .select('*, companies(name, slug)')
              .eq('id', payload.new.id)
              .single()
            if (data) {
              setServices((prev) => [...prev, data])
            }
          } else if (payload.eventType === 'UPDATE') {
            const { data } = await supabase
              .from('company_services')
              .select('*, companies(name, slug)')
              .eq('id', payload.new.id)
              .single()
            if (data) {
              setServices((prev) => prev.map((s) => (s.id === payload.new.id ? data : s)))
            }
          } else if (payload.eventType === 'DELETE') {
            setServices((prev) => prev.filter((s) => s.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredServices =
    selectedCompany === "all" ? services : services.filter((s) => s.company_id === selectedCompany)

  const handleSave = async (service: Partial<Service>) => {
    setLoading(true)
    try {
      if (editingService?.id) {
        // Update and fetch the updated data with company relationship
        const { data, error } = await supabase
          .from("company_services")
          .update(service)
          .eq("id", editingService.id)
          .select("*, companies(name, slug)")
          .single()

        if (!error && data) {
          setServices(services.map((s) => (s.id === editingService.id ? data : s)))
        }
      } else {
        const { data, error } = await supabase
          .from("company_services")
          .insert(service)
          .select("*, companies(name, slug)")
          .single()

        if (!error && data) {
          setServices([...services, data])
        }
      }
      setIsDialogOpen(false)
      setEditingService(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return

    const { error } = await supabase.from("company_services").delete().eq("id", id)

    if (!error) {
      setServices(services.filter((s) => s.id !== id))
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
            <Button onClick={() => setEditingService(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Update service details" : "Add a new service to a company"}
              </DialogDescription>
            </DialogHeader>
            <ServiceForm service={editingService} companies={companies} onSave={handleSave} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{service.title}</CardTitle>
                  <CardDescription className="text-xs">{service.companies?.name}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingService(service)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-foreground mb-2">{service.price}</p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
              <div className="flex flex-wrap gap-1">
                {service.is_featured && <Badge>Featured</Badge>}
                {!service.is_visible && <Badge variant="secondary">Hidden</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ServiceForm({
  service,
  companies,
  onSave,
  loading,
}: {
  service: Service | null
  companies: Company[]
  onSave: (service: Partial<Service>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<Partial<Service>>(
    service || {
      company_id: companies[0]?.id || "",
      title: "",
      description: "",
      price: "",
      features: [],
      is_featured: false,
      is_visible: true,
      display_order: 0,
    },
  )
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (service) {
      setFormData(service)
    } else {
      setFormData({
        company_id: companies[0]?.id || "",
        title: "",
        description: "",
        price: "",
        features: [],
        is_featured: false,
        is_visible: true,
        display_order: 0,
      })
    }
  }, [service, companies])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index),
    })
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
          <Label>Service Title</Label>
          <Input
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Web Development"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Price</Label>
          <Input
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Starting at $5,000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Service description..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <Button type="button" onClick={addFeature} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.features || []).map((feature, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {feature}
              <button type="button" onClick={() => removeFeature(index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input
            type="number"
            value={formData.display_order || 0}
            onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
          <Label>Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_visible}
            onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
          />
          <Label>Visible</Label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : service ? "Update Service" : "Create Service"}
      </Button>
    </form>
  )
}
