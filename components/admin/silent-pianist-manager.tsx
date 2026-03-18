"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, GripVertical, Piano, Video } from "lucide-react"

interface SilentPianistVideo {
  id: string
  company_id: string
  title: string
  description: string | null
  platform: string
  embed_id: string
  tiktok_username: string | null
  thumbnail: string | null
  start_time: string | null
  end_time: string | null
  display_order: number
  is_visible: boolean
}

interface Company {
  id: string
  name: string
  slug: string
}

export function SilentPianistManager() {
  const [videos, setVideos] = useState<SilentPianistVideo[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<SilentPianistVideo | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "youtube",
    embed_id: "",
    tiktok_username: "TheSilentPianist",
    thumbnail: "",
    start_time: "",
    end_time: "",
    is_visible: true,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany) {
      fetchVideos()
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

  const fetchVideos = async () => {
    const { data } = await supabase
      .from("silent_pianist_videos")
      .select("*")
      .eq("company_id", selectedCompany)
      .order("display_order")
    if (data) setVideos(data)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      platform: "youtube",
      embed_id: "",
      tiktok_username: "TheSilentPianist",
      thumbnail: "",
      start_time: "",
      end_time: "",
      is_visible: true,
    })
    setEditingVideo(null)
  }

  const openEditDialog = (video: SilentPianistVideo) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || "",
      platform: video.platform,
      embed_id: video.embed_id,
      tiktok_username: video.tiktok_username || "TheSilentPianist",
      thumbnail: video.thumbnail || "",
      start_time: video.start_time || "",
      end_time: video.end_time || "",
      is_visible: video.is_visible,
    })
    setIsDialogOpen(true)
  }

  // Extract YouTube video ID from URL and clean invalid characters
  const extractVideoId = (input: string): string => {
    if (!input) return ""
    const trimmed = input.trim()
    
    // YouTube URL patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]+)/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
    ]
    
    for (const pattern of youtubePatterns) {
      const match = trimmed.match(pattern)
      if (match) {
        // Clean the ID - YouTube IDs are only alphanumeric, underscore, and hyphen
        return match[1].replace(/[^a-zA-Z0-9_-]/g, "")
      }
    }
    
    // If it looks like a raw ID (11 chars, valid characters only), use it
    const cleanedId = trimmed.replace(/[^a-zA-Z0-9_-]/g, "")
    if (cleanedId.length === 11) {
      return cleanedId
    }
    
    // Return cleaned input as fallback
    return cleanedId || trimmed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const embedId = extractVideoId(formData.embed_id)

    if (editingVideo) {
      await supabase
        .from("silent_pianist_videos")
        .update({
          title: formData.title,
          description: formData.description || null,
          platform: formData.platform,
          embed_id: embedId,
          tiktok_username: formData.tiktok_username || null,
          thumbnail: formData.thumbnail || null,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          is_visible: formData.is_visible,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingVideo.id)
    } else {
      await supabase.from("silent_pianist_videos").insert({
        company_id: selectedCompany,
        title: formData.title,
        description: formData.description || null,
        platform: formData.platform,
        embed_id: embedId,
        tiktok_username: formData.tiktok_username || null,
        thumbnail: formData.thumbnail || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        is_visible: formData.is_visible,
        display_order: videos.length + 1,
      })
    }

    setIsDialogOpen(false)
    resetForm()
    fetchVideos()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return
    await supabase.from("silent_pianist_videos").delete().eq("id", id)
    fetchVideos()
  }

  const toggleVisibility = async (video: SilentPianistVideo) => {
    await supabase
      .from("silent_pianist_videos")
      .update({ is_visible: !video.is_visible })
      .eq("id", video.id)
    fetchVideos()
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
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingVideo ? "Edit Video" : "Add Video"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Sunday Morning Worship - Piano Solo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="twitter">X (Twitter)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="embed_id">Video URL or ID</Label>
                <Input
                  id="embed_id"
                  value={formData.embed_id}
                  onChange={(e) => setFormData({ ...formData, embed_id: e.target.value })}
                  placeholder="Paste full URL or video ID"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.platform === "youtube" && "Paste YouTube URL or video ID (e.g., dQw4w9WgXcQ)"}
                  {formData.platform === "tiktok" && "Paste TikTok video ID"}
                  {formData.platform === "twitter" && "Paste X/Twitter post ID"}
                </p>
              </div>
              {formData.platform === "tiktok" && (
                <div className="space-y-2">
                  <Label htmlFor="tiktok_username">TikTok Username</Label>
                  <Input
                    id="tiktok_username"
                    value={formData.tiktok_username}
                    onChange={(e) => setFormData({ ...formData, tiktok_username: e.target.value.replace("@", "") })}
                    placeholder="TheSilentPianist"
                  />
                  <p className="text-xs text-muted-foreground">Without the @ symbol</p>
                </div>
              )}
              {formData.platform === "youtube" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time (Optional)</Label>
                    <Input
                      id="start_time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      placeholder="45:00 or 0:45:00"
                    />
                    <p className="text-xs text-muted-foreground">Format: MM:SS or HH:MM:SS</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time (Optional)</Label>
                    <Input
                      id="end_time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      placeholder="48:00 or 0:48:00"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to play to end</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Custom Thumbnail URL (Optional)</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
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
                {editingVideo ? "Update" : "Add"} Video
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Piano className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No videos yet. Add one to get started.</p>
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => (
            <Card key={video.id} className={!video.is_visible ? "opacity-50" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  {video.platform === "youtube" && (
                    <img
                      src={video.thumbnail || `https://img.youtube.com/vi/${video.embed_id}/default.jpg`}
                      alt={video.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{video.title}</h3>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded-full capitalize">
                        {video.platform === "twitter" ? "X" : video.platform}
                      </span>
                    </div>
                    {video.start_time && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.start_time}{video.end_time ? ` - ${video.end_time}` : ""}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">{video.embed_id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={video.is_visible}
                      onCheckedChange={() => toggleVisibility(video)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(video.id)}>
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
