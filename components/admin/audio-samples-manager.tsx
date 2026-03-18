"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, GripVertical, Music2, Headphones, PenTool } from "lucide-react"

interface AudioSample {
  id: string
  title: string
  description: string | null
  audio_url: string
  service_tier: string
  duration: string | null
  display_order: number
  is_visible: boolean
  company_id: string
}

interface Company {
  id: string
  name: string
  slug: string
}

const tierOptions = [
  { value: "accompaniment", label: "Accompaniment", icon: Music2 },
  { value: "live_performance", label: "Live Performance", icon: Headphones },
  { value: "arrangement", label: "Arrangement", icon: PenTool },
]

export function AudioSamplesManager() {
  const [samples, setSamples] = useState<AudioSample[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSample, setEditingSample] = useState<AudioSample | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio_url: "",
    service_tier: "accompaniment",
    duration: "",
    is_visible: true,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchSamples()
    }
  }, [selectedCompany])

  async function fetchCompanies() {
    const { data } = await supabase.from("companies").select("id, name, slug").order("name")
    if (data) {
      setCompanies(data)
      // Default to Wynora if exists
      const wynora = data.find((c) => c.slug === "wynora")
      if (wynora) {
        setSelectedCompany(wynora.id)
      } else if (data.length > 0) {
        setSelectedCompany(data[0].id)
      }
    }
    setIsLoading(false)
  }

  async function fetchSamples() {
    setIsLoading(true)
    const { data } = await supabase
      .from("audio_samples")
      .select("*")
      .eq("company_id", selectedCompany)
      .order("display_order")
    if (data) {
      setSamples(data)
    }
    setIsLoading(false)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      audio_url: "",
      service_tier: "accompaniment",
      duration: "",
      is_visible: true,
    })
    setEditingSample(null)
  }

  const openEditDialog = (sample: AudioSample) => {
    setEditingSample(sample)
    setFormData({
      title: sample.title,
      description: sample.description || "",
      audio_url: sample.audio_url,
      service_tier: sample.service_tier,
      duration: sample.duration || "",
      is_visible: sample.is_visible,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingSample) {
        const { error } = await supabase
          .from("audio_samples")
          .update({
            title: formData.title,
            description: formData.description || null,
            audio_url: formData.audio_url,
            service_tier: formData.service_tier,
            duration: formData.duration || null,
            is_visible: formData.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingSample.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("audio_samples").insert({
          title: formData.title,
          description: formData.description || null,
          audio_url: formData.audio_url,
          service_tier: formData.service_tier,
          duration: formData.duration || null,
          is_visible: formData.is_visible,
          company_id: selectedCompany,
          display_order: samples.length + 1,
        })

        if (error) throw error
      }

      await fetchSamples()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving audio sample:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this audio sample?")) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("audio_samples").delete().eq("id", id)
      if (error) throw error
      await fetchSamples()
    } catch (error) {
      console.error("Error deleting audio sample:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVisibility = async (sample: AudioSample) => {
    try {
      const { error } = await supabase
        .from("audio_samples")
        .update({ is_visible: !sample.is_visible })
        .eq("id", sample.id)
      if (error) throw error
      await fetchSamples()
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  const getTierIcon = (tier: string) => {
    const option = tierOptions.find((t) => t.value === tier)
    if (option) {
      const Icon = option.icon
      return <Icon className="w-4 h-4" />
    }
    return null
  }

  const getTierLabel = (tier: string) => {
    return tierOptions.find((t) => t.value === tier)?.label || tier
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audio Samples</h1>
          <p className="text-muted-foreground">Manage audio samples for company service tiers</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setIsDialogOpen(true)
          }}
          disabled={!selectedCompany}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sample
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Label>Company:</Label>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger className="w-64">
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

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : samples.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No audio samples found. Add your first sample to showcase your service tiers.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {samples.map((sample) => (
            <Card key={sample.id} className={!sample.is_visible ? "opacity-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <div className="flex items-center gap-2 min-w-[140px]">
                    {getTierIcon(sample.service_tier)}
                    <span className="text-sm font-medium">{getTierLabel(sample.service_tier)}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{sample.title}</h3>
                    {sample.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{sample.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 truncate">{sample.audio_url}</p>
                  </div>
                  {sample.duration && (
                    <span className="text-sm text-muted-foreground">{sample.duration}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={sample.is_visible}
                      onCheckedChange={() => toggleVisibility(sample)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(sample)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sample.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSample ? "Edit Audio Sample" : "Add Audio Sample"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Amazing Grace - Piano Accompaniment"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A beautiful piano accompaniment..."
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio_url">Audio URL</Label>
              <Input
                id="audio_url"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="https://example.com/audio.mp3"
                required
              />
              <p className="text-xs text-muted-foreground">
                Direct link to MP3 or audio file
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_tier">Service Tier</Label>
              <Select
                value={formData.service_tier}
                onValueChange={(value) => setFormData({ ...formData, service_tier: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tierOptions.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      <div className="flex items-center gap-2">
                        <tier.icon className="w-4 h-4" />
                        {tier.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Optional)</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="3:45"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
              />
              <Label htmlFor="is_visible">Visible on site</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {editingSample ? "Update" : "Add"} Sample
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
