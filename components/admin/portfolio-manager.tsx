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
import { Pencil, Plus, Trash2, X, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  name: string
  slug: string
}

interface PortfolioItem {
  id: string
  company_id: string
  title: string
  description: string
  client_name: string
  image_url: string
  project_url: string
  tags: string[]
  is_visible: boolean
  display_order: number
  companies?: { name: string }
  // New metadata fields
  problem_solved?: string
  income_generated?: string
  time_to_build?: string
  technologies_used?: string[]
  key_features?: string[]
  lessons_learned?: string
  status?: string
}

export function PortfolioManager({
  initialPortfolio,
  companies,
}: { initialPortfolio: PortfolioItem[]; companies: Company[] }) {
  const [portfolio, setPortfolio] = useState(initialPortfolio)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  const filteredPortfolio =
    selectedCompany === "all" ? portfolio : portfolio.filter((p) => p.company_id === selectedCompany)

  const handleSave = async (item: Partial<PortfolioItem>) => {
    setLoading(true)
    try {
      if (editingItem?.id) {
        const { error } = await supabase.from("company_portfolio").update(item).eq("id", editingItem.id)

        if (!error) {
          setPortfolio(portfolio.map((p) => (p.id === editingItem.id ? ({ ...p, ...item } as PortfolioItem) : p)))
        }
      } else {
        const { data, error } = await supabase
          .from("company_portfolio")
          .insert(item)
          .select("*, companies(name)")
          .single()

        if (!error && data) {
          setPortfolio([...portfolio, data])
        }
      }
      setIsDialogOpen(false)
      setEditingItem(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return

    const { error } = await supabase.from("company_portfolio").delete().eq("id", id)

    if (!error) {
      setPortfolio(portfolio.filter((p) => p.id !== id))
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
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "Update portfolio details" : "Add a new work sample"}
              </DialogDescription>
            </DialogHeader>
            <PortfolioForm item={editingItem} companies={companies} onSave={handleSave} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortfolio.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.image_url && (
              <div className="aspect-video bg-muted">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {item.title}
                    {item.project_url && (
                      <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    )}
                  </CardTitle>
                  <CardDescription>{item.companies?.name}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingItem(item)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PortfolioForm({
  item,
  companies,
  onSave,
  loading,
}: {
  item: PortfolioItem | null
  companies: Company[]
  onSave: (item: Partial<PortfolioItem>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<Partial<PortfolioItem>>(
    item || {
      company_id: companies[0]?.id || "",
      title: "",
      description: "",
      client_name: "",
      image_url: "",
      project_url: "",
      tags: [],
      is_visible: true,
      display_order: 0,
      problem_solved: "",
      income_generated: "",
      time_to_build: "",
      technologies_used: [],
      key_features: [],
      lessons_learned: "",
      status: "completed",
    },
  )
  const [newTag, setNewTag] = useState("")
  const [newTech, setNewTech] = useState("")
  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        company_id: companies[0]?.id || "",
        title: "",
        description: "",
        client_name: "",
        image_url: "",
        project_url: "",
        tags: [],
        is_visible: true,
        display_order: 0,
        problem_solved: "",
        income_generated: "",
        time_to_build: "",
        technologies_used: [],
        key_features: [],
        lessons_learned: "",
        status: "completed",
      })
    }
  }, [item, companies])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((_, i) => i !== index),
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
          <Label>Project Title</Label>
          <Input
            value={formData.title || ""}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="E-commerce Platform"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Client Name</Label>
          <Input
            value={formData.client_name || ""}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Project description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={formData.image_url || ""}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>Project URL</Label>
          <Input
            value={formData.project_url || ""}
            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} variant="outline">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.tags || []).map((tag, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(index)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Project Metadata Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-medium mb-4">Project Details</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Problem Solved</Label>
            <Textarea
              value={formData.problem_solved || ""}
              onChange={(e) => setFormData({ ...formData, problem_solved: e.target.value })}
              placeholder="What problem did this project solve for the client?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Income Generated</Label>
              <Input
                value={formData.income_generated || ""}
                onChange={(e) => setFormData({ ...formData, income_generated: e.target.value })}
                placeholder="e.g., $5,000 or $500/month"
              />
            </div>
            <div className="space-y-2">
              <Label>Time to Build</Label>
              <Input
                value={formData.time_to_build || ""}
                onChange={(e) => setFormData({ ...formData, time_to_build: e.target.value })}
                placeholder="e.g., 2 weeks, 3 months"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              value={formData.status || "completed"} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="maintenance">Ongoing Maintenance</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Technologies Used</Label>
            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                placeholder="Add technology..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newTech.trim()) {
                      setFormData({
                        ...formData,
                        technologies_used: [...(formData.technologies_used || []), newTech.trim()],
                      })
                      setNewTech("")
                    }
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  if (newTech.trim()) {
                    setFormData({
                      ...formData,
                      technologies_used: [...(formData.technologies_used || []), newTech.trim()],
                    })
                    setNewTech("")
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.technologies_used || []).map((tech, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {tech}
                  <button 
                    type="button" 
                    onClick={() => setFormData({
                      ...formData,
                      technologies_used: (formData.technologies_used || []).filter((_, i) => i !== index),
                    })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Key Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add feature..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (newFeature.trim()) {
                      setFormData({
                        ...formData,
                        key_features: [...(formData.key_features || []), newFeature.trim()],
                      })
                      setNewFeature("")
                    }
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  if (newFeature.trim()) {
                    setFormData({
                      ...formData,
                      key_features: [...(formData.key_features || []), newFeature.trim()],
                    })
                    setNewFeature("")
                  }
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(formData.key_features || []).map((feature, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {feature}
                  <button 
                    type="button" 
                    onClick={() => setFormData({
                      ...formData,
                      key_features: (formData.key_features || []).filter((_, i) => i !== index),
                    })}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lessons Learned</Label>
            <Textarea
              value={formData.lessons_learned || ""}
              onChange={(e) => setFormData({ ...formData, lessons_learned: e.target.value })}
              placeholder="What did you learn from this project?"
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label>Visible on site</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : item ? "Update Portfolio Item" : "Create Portfolio Item"}
      </Button>
    </form>
  )
}
