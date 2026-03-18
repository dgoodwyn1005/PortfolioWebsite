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
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  name: string
  slug: string
}

interface FAQ {
  id: string
  company_id: string
  question: string
  answer: string
  is_visible: boolean
  display_order: number
  companies?: { name: string }
}

export function FAQsManager({ initialFaqs, companies }: { initialFaqs: FAQ[]; companies: Company[] }) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  const filteredFaqs = selectedCompany === "all" ? faqs : faqs.filter((f) => f.company_id === selectedCompany)

  const handleSave = async (faq: Partial<FAQ>) => {
    setLoading(true)
    try {
      if (editingFaq?.id) {
        const { error } = await supabase.from("company_faqs").update(faq).eq("id", editingFaq.id)

        if (!error) {
          setFaqs(faqs.map((f) => (f.id === editingFaq.id ? ({ ...f, ...faq } as FAQ) : f)))
        }
      } else {
        const { data, error } = await supabase.from("company_faqs").insert(faq).select("*, companies(name)").single()

        if (!error && data) {
          setFaqs([...faqs, data])
        }
      }
      setIsDialogOpen(false)
      setEditingFaq(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return

    const { error } = await supabase.from("company_faqs").delete().eq("id", id)

    if (!error) {
      setFaqs(faqs.filter((f) => f.id !== id))
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
            <Button onClick={() => setEditingFaq(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
              <DialogDescription>
                {editingFaq ? "Update FAQ details" : "Add a new frequently asked question"}
              </DialogDescription>
            </DialogHeader>
            <FAQForm faq={editingFaq} companies={companies} onSave={handleSave} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <Card key={faq.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                  <CardDescription>{faq.companies?.name}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingFaq(faq)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function FAQForm({
  faq,
  companies,
  onSave,
  loading,
}: {
  faq: FAQ | null
  companies: Company[]
  onSave: (faq: Partial<FAQ>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<Partial<FAQ>>(
    faq || {
      company_id: companies[0]?.id || "",
      question: "",
      answer: "",
      is_visible: true,
      display_order: 0,
    },
  )

  // Reset form data when faq prop changes (e.g., when editing a different FAQ)
  useEffect(() => {
    if (faq) {
      setFormData(faq)
    } else {
      setFormData({
        company_id: companies[0]?.id || "",
        question: "",
        answer: "",
        is_visible: true,
        display_order: 0,
      })
    }
  }, [faq, companies])

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

      <div className="space-y-2">
        <Label>Question</Label>
        <Input
          value={formData.question || ""}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="How long does a typical project take?"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Answer</Label>
        <Textarea
          value={formData.answer || ""}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          placeholder="The answer to the question..."
          rows={4}
          required
        />
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

      <div className="flex items-center gap-2">
        <Switch
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label>Visible on site</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : faq ? "Update FAQ" : "Create FAQ"}
      </Button>
    </form>
  )
}
