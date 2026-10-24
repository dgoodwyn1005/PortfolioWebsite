"use client"

import { useState, useEffect, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, X, Upload, Music, Play, Pause, Scissors } from "lucide-react"
import { AudioTrimmer } from "./audio-trimmer"

interface AudioClip {
  id: string
  title: string
  artist: string | null
  description: string | null
  audio_url: string
  cover_image: string | null
  duration: string | null
  genre: string | null
  company_id: string | null
  display_order: number
  is_visible: boolean
}

interface Company {
  id: string
  name: string
  slug: string
}

export function AudioClipsManager() {
  const [clips, setClips] = useState<AudioClip[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [showTrimmer, setShowTrimmer] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    description: "",
    audio_url: "",
    cover_image: "",
    duration: "",
    genre: "",
    company_id: "",
    display_order: 0,
    is_visible: true,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchClips()
    fetchCompanies()
  }, [])

  async function fetchClips() {
    const { data } = await supabase
      .from("audio_clips")
      .select("*")
      .order("display_order", { ascending: true })
    if (data) setClips(data)
    setLoading(false)
  }

  async function fetchCompanies() {
    const { data } = await supabase.from("companies").select("id, name, slug")
    if (data) setCompanies(data)
  }

  async function uploadAudio(file: File) {
    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formDataUpload })
      const data = await res.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, audio_url: data.url }))
      } else {
        alert(data.error || "Upload failed")
      }
    } catch {
      alert("Upload failed")
    }
    setUploading(false)
  }

  async function handleTrimComplete(blob: Blob, duration: string) {
    setUploading(true)
    try {
      const file = new File([blob], "trimmed-audio.wav", { type: "audio/wav" })
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formDataUpload })
      const data = await res.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, audio_url: data.url, duration }))
        setShowTrimmer(false)
      } else {
        alert(data.error || "Upload failed")
      }
    } catch {
      alert("Upload failed")
    }
    setUploading(false)
  }

  async function uploadCover(file: File) {
    setUploadingCover(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: formDataUpload })
      const data = await res.json()
      if (data.url) {
        setFormData((prev) => ({ ...prev, cover_image: data.url }))
      } else {
        alert(data.error || "Upload failed")
      }
    } catch {
      alert("Upload failed")
    }
    setUploadingCover(false)
  }

  async function handleSave() {
    if (!formData.title || !formData.audio_url) {
      alert("Title and audio file are required")
      return
    }

    const payload = {
      ...formData,
      company_id: formData.company_id || null,
    }

    if (editingId) {
      await supabase.from("audio_clips").update(payload).eq("id", editingId)
    } else {
      await supabase.from("audio_clips").insert([payload])
    }
    
    setEditingId(null)
    setIsAdding(false)
    setFormData({
      title: "",
      artist: "",
      description: "",
      audio_url: "",
      cover_image: "",
      duration: "",
      genre: "",
      company_id: "",
      display_order: 0,
      is_visible: true,
    })
    fetchClips()
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this audio clip?")) {
      await supabase.from("audio_clips").delete().eq("id", id)
      fetchClips()
    }
  }

  function startEdit(clip: AudioClip) {
    setEditingId(clip.id)
    setIsAdding(false)
    setFormData({
      title: clip.title,
      artist: clip.artist || "",
      description: clip.description || "",
      audio_url: clip.audio_url,
      cover_image: clip.cover_image || "",
      duration: clip.duration || "",
      genre: clip.genre || "",
      company_id: clip.company_id || "",
      display_order: clip.display_order,
      is_visible: clip.is_visible,
    })
  }

  function togglePlay(clipId: string, audioUrl: string) {
    if (playingId === clipId) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      audioRef.current.onended = () => setPlayingId(null)
      setPlayingId(clipId)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audio Clips</h2>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Audio Clip
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Audio Clip" : "Add New Audio Clip"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Track title"
                />
              </div>
              <div className="space-y-2">
                <Label>Artist</Label>
                <Input
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="Artist name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Audio File *</Label>
              {showTrimmer ? (
                <AudioTrimmer
                  maxDuration={30}
                  onTrimComplete={handleTrimComplete}
                  onCancel={() => setShowTrimmer(false)}
                />
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      value={formData.audio_url}
                      onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                      placeholder="Audio URL"
                      className="flex-1"
                    />
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && uploadAudio(e.target.files[0])}
                      />
                      <Button type="button" variant="outline" disabled={uploading} asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? "Uploading..." : "Upload Full"}
                        </span>
                      </Button>
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowTrimmer(true)}
                    >
                      <Scissors className="w-4 h-4 mr-2" />
                      Trim Clip
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use &quot;Trim Clip&quot; to upload longer files and select a 30-second snippet
                  </p>
                </>
              )}
              {formData.audio_url && !showTrimmer && (
                <audio controls className="w-full mt-2">
                  <source src={formData.audio_url} />
                </audio>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="Cover image URL"
                  className="flex-1"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                  />
                  <Button type="button" variant="outline" disabled={uploadingCover} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingCover ? "Uploading..." : "Upload"}
                    </span>
                  </Button>
                </label>
              </div>
              {formData.cover_image && (
                <img src={formData.cover_image || "/placeholder.svg"} alt="Cover" className="w-24 h-24 object-cover rounded mt-2" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Genre</Label>
                <Input
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="e.g., Gospel, R&B"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 3:45"
                />
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Show on Company Page</Label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
              >
                <option value="">None (Main site only)</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_visible"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
              />
              <Label htmlFor="is_visible">Visible</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setIsAdding(false)
                  setFormData({
                    title: "",
                    artist: "",
                    description: "",
                    audio_url: "",
                    cover_image: "",
                    duration: "",
                    genre: "",
                    company_id: "",
                    display_order: 0,
                    is_visible: true,
                  })
                }}
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {clips.map((clip) => (
          <Card key={clip.id} className={!clip.is_visible ? "opacity-50" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  {clip.cover_image ? (
                    <img src={clip.cover_image || "/placeholder.svg"} alt={clip.title} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                      <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <button
                    onClick={() => togglePlay(clip.id, clip.audio_url)}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded opacity-0 hover:opacity-100 transition-opacity"
                  >
                    {playingId === clip.id ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{clip.title}</h3>
                  {clip.artist && <p className="text-sm text-muted-foreground">{clip.artist}</p>}
                  <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                    {clip.genre && <span>{clip.genre}</span>}
                    {clip.duration && <span>{clip.duration}</span>}
                    {clip.company_id && (
                      <span className="text-primary">
                        {companies.find((c) => c.id === clip.company_id)?.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(clip)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(clip.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {clips.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No audio clips yet. Add your first one!</p>
        )}
      </div>
    </div>
  )
}
