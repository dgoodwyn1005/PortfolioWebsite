"use client"
// Updated: TikTok + Piano support added

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2, Music, Trophy, Video } from "lucide-react"

interface VideoItem {
  id: string
  title: string
  embed_id: string
  section: string
  platform: string
  display_order: number
  is_visible: boolean
}

export function VideosManager({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState(initialVideos)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    embed_id: "",
    section: "music",
    platform: "youtube",
    is_visible: true,
  })

  const resetForm = () => {
    setFormData({ title: "", embed_id: "", section: "music", platform: "youtube", is_visible: true })
    setEditingVideo(null)
  }

  const openEditDialog = (video: VideoItem) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      embed_id: video.embed_id,
      section: video.section,
      platform: video.platform || "youtube",
      is_visible: video.is_visible,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from("videos")
          .update({
            title: formData.title,
            embed_id: formData.embed_id,
            section: formData.section,
            platform: formData.platform,
            is_visible: formData.is_visible,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingVideo.id)

        if (error) throw error
      } else {
        const sectionVideos = videos.filter((v) => v.section === formData.section)
        const { error } = await supabase.from("videos").insert({
          title: formData.title,
          embed_id: formData.embed_id,
          section: formData.section,
          platform: formData.platform,
          is_visible: formData.is_visible,
          display_order: sectionVideos.length + 1,
        })

        if (error) throw error
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()

      const { data } = await supabase.from("videos").select("*").order("section").order("display_order")
      if (data) setVideos(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    const supabase = createClient()
    const { error } = await supabase.from("videos").delete().eq("id", id)

    if (!error) {
      setVideos(videos.filter((v) => v.id !== id))
      router.refresh()
    }
  }

  const musicVideos = videos.filter((v) => v.section === "music")
  const pianoVideos = videos.filter((v) => v.section === "piano")
  const basketballVideos = videos.filter((v) => v.section === "basketball")

  return (
    <div className="space-y-6">
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Video
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            <DialogDescription>Add a YouTube or TikTok video to your portfolio.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Sunday Morning Worship Set"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="embed_id">
                {formData.platform === "tiktok" ? "TikTok Video ID" : "YouTube Video ID"}
              </Label>
              <Input
                id="embed_id"
                value={formData.embed_id}
                onChange={(e) => {
                  let value = e.target.value.trim()
                  // Auto-extract ID from full URLs
                  if (formData.platform === "tiktok") {
                    const tiktokMatch = value.match(/video\/(\d+)/)
                    if (tiktokMatch) value = tiktokMatch[1]
                  } else {
                    const ytMatch = value.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]+)/)
                    if (ytMatch) value = ytMatch[1]
                  }
                  setFormData({ ...formData, embed_id: value })
                }}
                placeholder={formData.platform === "tiktok" ? "7123456789012345678" : "dQw4w9WgXcQ"}
                required
              />
              {formData.platform === "tiktok" ? (
                <p className="text-xs text-muted-foreground">
                  Paste the full TikTok URL or just the video ID. Example: tiktok.com/@TheSilentPianist/video/<strong>7123456789012345678</strong>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Paste the full YouTube URL or just the video ID. Example: youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Music
                    </div>
                  </SelectItem>
                  <SelectItem value="piano">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Piano
                    </div>
                  </SelectItem>
                  <SelectItem value="basketball">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Basketball
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
              />
              <Label htmlFor="is_visible">Visible on site</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingVideo ? "Update Video" : "Add Video"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Music Videos</h2>
          </div>
          <div className="grid gap-3">
            {musicVideos.map((video) => (
              <Card key={video.id} className={!video.is_visible ? "opacity-50" : ""}>
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">{video.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
            {musicVideos.length === 0 && <p className="text-sm text-muted-foreground">No music videos yet.</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Piano Videos (TheSilentPianist)</h2>
          </div>
          <div className="grid gap-3">
            {pianoVideos.map((video) => (
              <Card key={video.id} className={!video.is_visible ? "opacity-50" : ""}>
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">{video.title}</CardTitle>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{video.platform || "youtube"}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
            {pianoVideos.length === 0 && <p className="text-sm text-muted-foreground">No piano videos yet.</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Basketball Videos</h2>
          </div>
          <div className="grid gap-3">
            {basketballVideos.map((video) => (
              <Card key={video.id} className={!video.is_visible ? "opacity-50" : ""}>
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">{video.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(video)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
            {basketballVideos.length === 0 && (
              <p className="text-sm text-muted-foreground">No basketball videos yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
