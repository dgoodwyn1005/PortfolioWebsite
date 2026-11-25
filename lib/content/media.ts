import "server-only"

import { createPublicClient } from "@/lib/supabase/server"

import type {
  ContentWorld,
} from "@/lib/content/types"

export interface Photo {
  id: string
  image_url: string
  caption: string | null
  display_order: number | null
  featured_order: number | null
  world: string | null
}

export interface Video {
  id: string
  title: string
  embed_id: string
  section: string
  platform: string | null
  tiktok_username: string | null
  thumbnail_url: string | null
  presentation_format?: string | null
  youtube_video_id?: string | null
  tiktok_video_id?: string | null
  start_time: string | null
  end_time: string | null
  world: string | null
}

export async function getFeaturedPhotos(strict = false): Promise<Photo[]> {
  try {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from("photo_gallery")
      .select(`
        id,
        image_url,
        caption,
        display_order,
        featured_order,
        world
      `)
      .eq("is_visible", true)
      .eq("featured_home", true)
      .order("featured_order", {
        ascending: true,
      })
      .limit(5)

    if (error) {
      console.error(
        "[content/media] Failed to load featured photos:",
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      )

      if (strict) throw error
      return []
    }

    return data ?? []
  } catch (error) {
    console.error(
      "[content/media] Supabase unavailable while loading photos:",
      error,
    )

    if (strict) throw error
    return []
  }
}

export async function getFeaturedVideos(strict = false): Promise<Video[]> {
  try {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from("videos")
      .select(`
        id,
        title,
        embed_id,
        section,
        platform,
        tiktok_username,
        thumbnail_url,
        presentation_format,
        youtube_video_id,
        tiktok_video_id,
        start_time,
        end_time,
        world
      `)
      .eq("is_visible", true)
      .eq("featured_home", true)
      .order("featured_order", {
        ascending: true,
      })
      .limit(3)

    if (error) {
      console.error(
        "[content/media] Failed to load featured videos:",
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      )

      if (strict) throw error
      return []
    }

    return data ?? []
  } catch (error) {
    console.error(
      "[content/media] Supabase unavailable while loading videos:",
      error,
    )

    if (strict) throw error
    return []
  }
}

export async function getPhotosByWorld(
  world: ContentWorld,
  strict = false,
): Promise<Photo[]> {
  try {
    const supabase =
      createPublicClient()

    const { data, error } =
      await supabase
        .from("photo_gallery")
        .select(`
          id,
          image_url,
          caption,
          display_order,
          featured_order,
          world
        `)
        .eq("is_visible", true)
        .eq("world", world)
        .order("display_order", {
          ascending: true,
        })

    if (error) {
      console.error(
        `[content/media] Failed to load ${world} photos:`,
        {
          message:
            error.message,
          details:
            error.details,
          hint:
            error.hint,
          code:
            error.code,
        },
      )

      if (strict) throw error
      return []
    }

    return data ?? []
  } catch (error) {
    console.error(
      `[content/media] Supabase unavailable while loading ${world} photos:`,
      error,
    )

    if (strict) throw error
    return []
  }
}

export async function getVideosByWorld(
  world: ContentWorld,
  strict = false,
): Promise<Video[]> {
  try {
    const supabase =
      createPublicClient()

    const { data, error } =
      await supabase
        .from("videos")
        .select(`
          id,
          title,
          embed_id,
          section,
          platform,
          tiktok_username,
          thumbnail_url,
          presentation_format,
          youtube_video_id,
          tiktok_video_id,
          start_time,
          end_time,
          world
        `)
        .eq("is_visible", true)
        .eq("world", world)
        .order("display_order", {
          ascending: true,
        })

    if (error) {
      console.error(
        `[content/media] Failed to load ${world} videos:`,
        {
          message:
            error.message,
          details:
            error.details,
          hint:
            error.hint,
          code:
            error.code,
        },
      )

      if (strict) throw error
      return []
    }

    return data ?? []
  } catch (error) {
    console.error(
      `[content/media] Supabase unavailable while loading ${world} videos:`,
      error,
    )

    if (strict) throw error
    return []
  }
}