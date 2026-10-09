"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"

import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import {
  AlertCircle,
  GripVertical,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"

import { ImagePicker } from "./image-picker"

interface Photo {
  id: string
  image_url: string
  caption: string | null
  display_order: number
  is_visible: boolean
}

export function PhotoGalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [newPhoto, setNewPhoto] = useState({
    image_url: "",
    caption: "",
  })

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    void fetchPhotos()
  }, [])

  async function fetchPhotos() {
    const { data, error: dbError } = await supabase
      .from("photo_gallery")
      .select("*")
      .order("display_order", {
        ascending: true,
      })

    if (dbError) {
      console.error(
        "Failed to load photos:",
        dbError,
      )

      setError(
        "Failed to load photos. Please try again.",
      )

      setLoading(false)
      return
    }

    if (data) {
      setPhotos(data as Photo[])
    }

    setLoading(false)
  }

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    setError(null)

    const maxSize = 10 * 1024 * 1024

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/avif",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload: JPG, PNG, GIF, WebP, SVG, or AVIF.",
      )

      e.target.value = ""
      return
    }

    if (file.size > maxSize) {
      setError(
        `File too large (${(
          file.size /
          1024 /
          1024
        ).toFixed(
          1,
        )}MB). Maximum size is 10MB.`,
      )

      e.target.value = ""
      return
    }

    setUploading(true)

    const formData = new FormData()

    formData.append("file", file)

    try {
      const res = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        },
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Upload failed",
        )
      }

      if (data.url) {
        setNewPhoto((current) => ({
          ...current,
          image_url: data.url,
        }))
      }
    } catch (err) {
      console.error(
        "Upload failed:",
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please try again.",
      )
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function addPhoto() {
    if (!newPhoto.image_url) {
      return
    }

    setSaving(true)
    setError(null)

    const {
      data,
      error: dbError,
    } = await supabase
      .from("photo_gallery")
      .insert({
        image_url:
          newPhoto.image_url,
        caption:
          newPhoto.caption ||
          null,
        display_order:
          photos.length,
        is_visible: true,
      })
      .select()
      .single()

    if (dbError) {
      console.error(
        "Failed to add photo:",
        dbError,
      )

      setError(
        "Failed to add photo. Please try again.",
      )

      setSaving(false)
      return
    }

    if (data) {
      setPhotos((current) => [
        ...current,
        data as Photo,
      ])

      setNewPhoto({
        image_url: "",
        caption: "",
      })
    }

    setSaving(false)
  }

  async function updatePhoto(
    id: string,
    updates: Partial<Photo>,
  ) {
    const { error: dbError } =
      await supabase
        .from("photo_gallery")
        .update(updates)
        .eq("id", id)

    if (dbError) {
      console.error(
        "Failed to update photo:",
        dbError,
      )

      setError(
        "Failed to update photo.",
      )

      return
    }

    setPhotos((current) =>
      current.map((photo) =>
        photo.id === id
          ? {
              ...photo,
              ...updates,
            }
          : photo,
      ),
    )
  }

  async function deletePhoto(
    id: string,
  ) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?",
    )

    if (!confirmed) {
      return
    }

    const { error: dbError } =
      await supabase
        .from("photo_gallery")
        .delete()
        .eq("id", id)

    if (dbError) {
      console.error(
        "Failed to delete photo:",
        dbError,
      )

      setError(
        "Failed to delete photo.",
      )

      return
    }

    setPhotos((current) =>
      current.filter(
        (photo) =>
          photo.id !== id,
      ),
    )
  }

  async function movePhoto(
    index: number,
    direction: "up" | "down",
  ) {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1

    if (
      newIndex < 0 ||
      newIndex >= photos.length
    ) {
      return
    }

    const reorderedPhotos = [
      ...photos,
    ]

    const [movedPhoto] =
      reorderedPhotos.splice(
        index,
        1,
      )

    reorderedPhotos.splice(
      newIndex,
      0,
      movedPhoto,
    )

    const updates =
      reorderedPhotos.map(
        (photo, order) => ({
          ...photo,
          display_order: order,
        }),
      )

    setPhotos(updates)

    for (const photo of updates) {
      const { error: dbError } =
        await supabase
          .from("photo_gallery")
          .update({
            display_order:
              photo.display_order,
          })
          .eq("id", photo.id)

      if (dbError) {
        console.error(
          "Failed to reorder photo:",
          dbError,
        )

        setError(
          "Failed to save the new photo order.",
        )

        return
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Plus className="h-5 w-5" />
            Add New Photo
          </h3>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />

              <span>
                {error}
              </span>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>
                  Photo
                </Label>

                <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={
                      newPhoto.image_url
                    }
                    onChange={(e) =>
                      setNewPhoto(
                        (current) => ({
                          ...current,
                          image_url:
                            e.target
                              .value,
                        }),
                      )
                    }
                    placeholder="Image URL"
                    className="min-w-0 flex-1"
                  />

                  <div className="w-full sm:w-44">
                    <ImagePicker
                      value={
                        newPhoto.image_url
                      }
                      onChange={(
                        url,
                      ) => {
                        setNewPhoto(
                          (
                            current,
                          ) => ({
                            ...current,
                            image_url:
                              url,
                          }),
                        )
                      }}
                      label="Choose Existing"
                    />
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  <Label
                    htmlFor="photo-upload"
                    className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-4 py-2 transition-colors hover:bg-muted ${
                      uploading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}

                    {uploading
                      ? "Uploading..."
                      : "Upload New"}
                  </Label>

                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml,image/avif"
                    className="hidden"
                    onChange={
                      handleUpload
                    }
                    disabled={
                      uploading
                    }
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG, GIF,
                  WebP, SVG, AVIF.
                  Max 10MB.
                </p>
              </div>

              <div>
                <Label>
                  Caption
                  (optional)
                </Label>

                <Input
                  value={
                    newPhoto.caption
                  }
                  onChange={(e) =>
                    setNewPhoto(
                      (current) => ({
                        ...current,
                        caption:
                          e.target
                            .value,
                      }),
                    )
                  }
                  placeholder="Add a caption..."
                  className="mt-1"
                />
              </div>

              <Button
                onClick={addPhoto}
                disabled={
                  !newPhoto.image_url ||
                  saving
                }
                className="min-h-11 w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Photo"
                )}
              </Button>
            </div>

            <div className="flex items-center justify-center">
              {newPhoto.image_url ? (
                <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={
                      newPhoto.image_url ||
                      "/placeholder.svg"
                    }
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target =
                        e.target as HTMLImageElement

                      target.src =
                        "/abstract-colorful-photo.png"
                    }}
                  />
                </div>
              ) : (
                <div className="flex aspect-square w-full max-w-[200px] items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Your Photos (
          {photos.length})
        </h3>

        {photos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No photos yet.
              Add your first
              photo above!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {photos.map(
              (
                photo,
                index,
              ) => (
                <Card
                  key={
                    photo.id
                  }
                  className={
                    !photo.is_visible
                      ? "opacity-50"
                      : ""
                  }
                >
                  <CardContent className="py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex gap-1 sm:flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() =>
                            movePhoto(
                              index,
                              "up",
                            )
                          }
                          disabled={
                            index === 0
                          }
                          aria-label="Move photo up"
                        >
                          <GripVertical className="h-4 w-4 rotate-90" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() =>
                            movePhoto(
                              index,
                              "down",
                            )
                          }
                          disabled={
                            index ===
                            photos.length -
                              1
                          }
                          aria-label="Move photo down"
                        >
                          <GripVertical className="h-4 w-4 -rotate-90" />
                        </Button>
                      </div>

                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={
                            photo.image_url ||
                            "/placeholder.svg"
                          }
                          alt={
                            photo.caption ||
                            "Photo"
                          }
                          fill
                          className="object-cover"
                          onError={(
                            e,
                          ) => {
                            const target =
                              e.target as HTMLImageElement

                            target.src =
                              "/abstract-colorful-photo.png"
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <Input
                          value={
                            photo.caption ||
                            ""
                          }
                          onChange={(
                            e,
                          ) =>
                            updatePhoto(
                              photo.id,
                              {
                                caption:
                                  e
                                    .target
                                    .value,
                              },
                            )
                          }
                          placeholder="Add caption..."
                          className="mb-2"
                        />

                        <p className="truncate text-xs text-muted-foreground">
                          {
                            photo.image_url
                          }
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 sm:justify-start">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`visible-${photo.id}`}
                            className="text-sm"
                          >
                            Visible
                          </Label>

                          <Switch
                            id={`visible-${photo.id}`}
                            checked={
                              photo.is_visible
                            }
                            onCheckedChange={(
                              checked,
                            ) =>
                              updatePhoto(
                                photo.id,
                                {
                                  is_visible:
                                    checked,
                                },
                              )
                            }
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 text-destructive hover:text-destructive"
                          onClick={() =>
                            deletePhoto(
                              photo.id,
                            )
                          }
                          aria-label="Delete photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}