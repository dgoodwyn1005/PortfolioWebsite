"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, GripVertical, Music } from "lucide-react"

interface AudioSample {
  id: string
  company_id: string
  title: string
  description: string | null
  audio_url: string
  service_tier: string
  duration: string | null
  display_order: number
  is_visible: boolean
}

interface Company {
  id: string
  name: string
  slug: string
}

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

  const fetchCompanies = async () => {
    const { data } = await supabase.from("companies").select("id, name, slug").order("name")
    if (data) {
      setCompanies(data)
      if (data.length > 0) {
        const wynora = data.find(c => c.slug === "wynora")
        setSelectedCompany(wynora?.id || data[0].id)
      }
    }
    setIsLoading(false)
  }

  const fetchSamples = async () => {
    const { data } = await supabase
      .from("audio_samples")
      .select("*")
      .eq("company_id", selectedCompany)
      .order("display_order")
    if (data) setSamples(data)
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
    
    if (editingSample) {
      await supabase
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
    } else {
      await supabase.from("audio_samples").insert({
        company_id: selectedCompany,
        title: formData.title,
        description: formData.description || null,
        audio_url: formData.audio_url,
        service_tier: formData.service_tier,
        duration: formData.duration || null,
        is_visible: formData.is_visible,
        display_order: samples.length + 1,
      })
    }

    setIsDialogOpen(false)
    resetForm()
    fetchSamples()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this audio sample?")) return
    await supabase.from("audio_samples").delete().eq("id", id)
    fetchSamples()
  }

  const toggleVisibility = async (sample: AudioSample) => {
    await supabase
      .from("audio_samples")
      .update({ is_visible: !sample.is_visible })
      .eq("id", sample.id)
    fetchSamples()
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="w-64">
          <Label>Company</Label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
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

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Audio Sample
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio_url">Audio URL</Label>
                <Input
                  id="audio_url"
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_tier">Service Tier</Label>
                  <Select value={formData.service_tier} onValueChange={(v) => setFormData({ ...formData, service_tier: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accompaniment">Accompaniment</SelectItem>
                      <SelectItem value="live_performance">Live Performance</SelectItem>
                      <SelectItem value="arrangement">Arrangement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="3:45"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
                />
                <Label htmlFor="is_visible">Visible</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingSample ? "Update" : "Create"} Audio Sample
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {samples.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No audio samples yet. Add one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          samples.map((sample) => (
            <Card key={sample.id} className={!sample.is_visible ? "opacity-50" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{sample.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">
                        {sample.service_tier.replace("_", " ")}
                      </span>
                    </div>
                    {sample.description && (
                      <p className="text-sm text-muted-foreground mt-1">{sample.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{sample.audio_url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={sample.is_visible}
                      onCheckedChange={() => toggleVisibility(sample)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(sample)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sample.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
