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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Company {
  id: string
  name: string
  slug: string
}

interface TeamMember {
  id: string
  company_id: string
  name: string
  role: string
  bio: string
  image_url: string
  linkedin_url: string
  is_visible: boolean
  display_order: number
  companies?: { name: string }
}

export function TeamManager({ initialTeam, companies }: { initialTeam: TeamMember[]; companies: Company[] }) {
  const [team, setTeam] = useState(initialTeam)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const router = useRouter()
  const supabase = createClient()

  const filteredTeam = selectedCompany === "all" ? team : team.filter((t) => t.company_id === selectedCompany)

  const handleSave = async (member: Partial<TeamMember>) => {
    setLoading(true)
    try {
      if (editingMember?.id) {
        const { error } = await supabase.from("company_team").update(member).eq("id", editingMember.id)

        if (!error) {
          setTeam(team.map((t) => (t.id === editingMember.id ? ({ ...t, ...member } as TeamMember) : t)))
        }
      } else {
        const { data, error } = await supabase.from("company_team").insert(member).select("*, companies(name)").single()

        if (!error && data) {
          setTeam([...team, data])
        }
      }
      setIsDialogOpen(false)
      setEditingMember(null)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    const { error } = await supabase.from("company_team").delete().eq("id", id)

    if (!error) {
      setTeam(team.filter((t) => t.id !== id))
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
            <Button onClick={() => setEditingMember(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
              <DialogDescription>
                {editingMember ? "Update team member details" : "Add a new team member"}
              </DialogDescription>
            </DialogHeader>
            <TeamMemberForm member={editingMember} companies={companies} onSave={handleSave} loading={loading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => (
          <Card key={member.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.image_url || "/placeholder.svg"} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setEditingMember(member)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">{member.companies?.name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function TeamMemberForm({
  member,
  companies,
  onSave,
  loading,
}: {
  member: TeamMember | null
  companies: Company[]
  onSave: (member: Partial<TeamMember>) => void
  loading: boolean
}) {
  const [formData, setFormData] = useState<Partial<TeamMember>>(
    member || {
      company_id: companies[0]?.id || "",
      name: "",
      role: "",
      bio: "",
      image_url: "",
      linkedin_url: "",
      is_visible: true,
      display_order: 0,
    },
  )

  useEffect(() => {
    if (member) {
      setFormData(member)
    } else {
      setFormData({
        company_id: companies[0]?.id || "",
        name: "",
        role: "",
        bio: "",
        image_url: "",
        linkedin_url: "",
        is_visible: true,
        display_order: 0,
      })
    }
  }, [member, companies])

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
          <Label>Name</Label>
          <Input
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Input
            value={formData.role || ""}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="Lead Developer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          value={formData.bio || ""}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Team member bio..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Photo URL</Label>
          <Input
            value={formData.image_url || ""}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input
            value={formData.linkedin_url || ""}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/..."
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
        {loading ? "Saving..." : member ? "Update Team Member" : "Create Team Member"}
      </Button>
    </form>
  )
}
