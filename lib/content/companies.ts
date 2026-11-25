import "server-only"

import { createPublicClient } from "@/lib/supabase/server"

function logError(
  label: string,
  error: {
    message?: string
    details?: string
    hint?: string
    code?: string
  } | null,
) {
  if (!error) return

  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  })
}

export async function getCompanyPageData(
  slug: string,
  strict = false,
) {
  try {
    const supabase = createPublicClient()

    const {
      data: company,
      error: companyError,
    } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()

    if (companyError) {
      logError(
        `[content/company] Failed to load ${slug}:`,
        companyError,
      )

      if (strict) throw companyError
      return null
    }

    if (!company) {
      return null
    }

    const [
      servicesResult,
      portfolioResult,
      testimonialsResult,
      faqsResult,
    ] = await Promise.all([
      supabase
        .from("company_services")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),

      supabase
        .from("company_portfolio")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),

      supabase
        .from("company_testimonials")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_visible", true)
        .eq("status", "approved")
        .order("display_order", {
          ascending: true,
        }),

      supabase
        .from("company_faqs")
        .select("*")
        .eq("company_id", company.id)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),
    ])

    logError(
      `[content/company] Failed to load ${slug} services:`,
      servicesResult.error,
    )

    logError(
      `[content/company] Failed to load ${slug} portfolio:`,
      portfolioResult.error,
    )

    logError(
      `[content/company] Failed to load ${slug} testimonials:`,
      testimonialsResult.error,
    )

    logError(
      `[content/company] Failed to load ${slug} FAQs:`,
      faqsResult.error,
    )

    if (strict && (servicesResult.error || portfolioResult.error || testimonialsResult.error || faqsResult.error)) throw new Error("Failed to load company content")

    return {
      company,

      services:
        servicesResult.data ?? [],

      portfolio:
        portfolioResult.data ?? [],

      testimonials:
        testimonialsResult.data ?? [],

      faqs:
        faqsResult.data ?? [],
    }
  } catch (error) {
    console.error(
      `[content/company] Supabase unavailable for ${slug}:`,
      error,
    )

    if (strict) throw error
    return null
  }
}

export async function getWynoraMediaData(
  companyId: string,
  strict = false,
) {
  try {
    const supabase = createPublicClient()

    const [
      audioClipsResult,
      silentPianistResult,
      audioSamplesResult,
      musicVideosResult,
    ] = await Promise.all([
      supabase
        .from("audio_clips")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),

      supabase
        .from("silent_pianist_videos")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),

      supabase
        .from("audio_samples")
        .select("*")
        .eq("company_id", companyId)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),

      supabase
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
        .in(
          "section",
          [
            "music",
            "piano",
            "worship",
          ],
        )
        .order("display_order", {
          ascending: true,
        })
        .limit(3),
    ])

    logError(
      "[content/wynora] Failed to load audio clips:",
      audioClipsResult.error,
    )

    logError(
      "[content/wynora] Failed to load Silent Pianist videos:",
      silentPianistResult.error,
    )

    logError(
      "[content/wynora] Failed to load audio samples:",
      audioSamplesResult.error,
    )

    logError(
      "[content/wynora] Failed to load music videos:",
      musicVideosResult.error,
    )

    if (strict && (audioClipsResult.error || silentPianistResult.error || audioSamplesResult.error || musicVideosResult.error)) throw new Error("Failed to load Wynora media")

    return {
      audioClips:
        audioClipsResult.data ?? [],

      silentPianistVideos:
        silentPianistResult.data ?? [],

      audioSamples:
        audioSamplesResult.data ?? [],

      musicVideos:
        musicVideosResult.data ?? [],
    }
  } catch (error) {
    console.error(
      "[content/wynora] Supabase unavailable:",
      error,
    )

    if (strict) throw error
    return {
      audioClips: [],
      silentPianistVideos: [],
      audioSamples: [],
      musicVideos: [],
    }
  }
}