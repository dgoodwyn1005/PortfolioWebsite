import "server-only"

import { createPublicClient } from "@/lib/supabase/server"

import type {
  ContentWorld,
} from "@/lib/content/types"

export interface Project {
  id: string
  title: string
  description: string
  tech: string[] | null
  image_url: string | null
  live_url: string | null
  github_url: string | null
  slug: string | null
  year: number | null
  world: string | null
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const supabase =
      createPublicClient()

    const { data, error } =
      await supabase
        .from("projects")
        .select(`
          id,
          title,
          description,
          tech,
          image_url,
          live_url,
          github_url,
          slug,
          year,
          world
        `)
        .eq("is_visible", true)
        .eq(
          "featured_home",
          true,
        )
        .order(
          "featured_order",
          {
            ascending: true,
          },
        )
        .limit(3)

    if (error) {
      console.error(
        "[content/projects] Failed to load featured projects:",
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

      return []
    }

    return data ?? []
  } catch (error) {
    console.error(
      "[content/projects] Supabase unavailable:",
      error,
    )

    return []
  }
}

export async function getProjectsByWorld(
  world: ContentWorld,
): Promise<Project[]> {
  try {
    const supabase =
      createPublicClient()

    const { data, error } =
      await supabase
        .from("projects")
        .select(`
          id,
          title,
          description,
          tech,
          image_url,
          live_url,
          github_url,
          slug,
          year,
          world
        `)
        .eq("is_visible", true)
        .eq("world", world)
        .order("display_order", {
          ascending: true,
        })

    if (error) {
      console.error(
        `[content/projects] Failed to load ${world} projects:`,
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

      return []
    }

    return data ?? []
  } catch (error) {
    console.error(
      `[content/projects] Supabase unavailable for ${world}:`,
      error,
    )

    return []
  }
}