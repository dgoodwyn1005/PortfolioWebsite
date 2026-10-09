import "server-only"

import {
  createPublicClient,
} from "@/lib/supabase/server"

import type {
  ContentWorld,
} from "@/lib/content/types"

const SITE_SETTING_KEYS = [
  // Global / hero
  "site_logo",
  "hero_background_image",
  "hero_description",

  // About
  "about_profile_image",
  "about_paragraph_1",
  "about_paragraph_2",
  "about_paragraph_3",
  "resume_url",

  // Contact
  "contact_heading",
  "contact_description",
  "scheduling_url",
  "calendly_url",
  "scheduling_button_text",
] as const

export interface QuickStat {
  id: string
  label: string
  value: string
}

export interface SocialLink {
  id: string
  name: string
  url: string
  icon: string
}

export interface NavigationData {
  logo: string | null
  linkedinUrl: string | null
}

export interface HeroData {
  backgroundImage: string | null
  description: string | null
}

export interface AboutData {
  profileImage: string | null
  aboutParagraph1: string | null
  aboutParagraph2: string | null
  aboutParagraph3: string | null
  resumeUrl: string | null
  stats: QuickStat[]
}

export interface ContactData {
  settings: Record<string, string>
  socialLinks: SocialLink[]
}

interface HomeSiteContent {
  navigation: NavigationData
  hero: HeroData
  about: AboutData
  contact: ContactData
}

const fallback: HomeSiteContent = {
  navigation: {
    logo: null,
    linkedinUrl: null,
  },

  hero: {
    backgroundImage: null,
    description: null,
  },

  about: {
    profileImage: null,
    aboutParagraph1: null,
    aboutParagraph2: null,
    aboutParagraph3: null,
    resumeUrl: null,
    stats: [],
  },

  contact: {
    settings: {},
    socialLinks: [],
  },
}

export async function getHomeSiteContent(): Promise<HomeSiteContent> {
  try {
    const supabase =
      createPublicClient()

    const [
      settingsResult,
      statsResult,
      socialResult,
    ] = await Promise.all([
      supabase
        .from("site_settings")
        .select("key, value")
        .in(
          "key",
          [...SITE_SETTING_KEYS],
        ),

      supabase
        .from("quick_stats")
        .select(`
          id,
          label,
          value
        `)
        .eq("is_visible", true)
        .eq("featured_home", true)
        .order("featured_order", {
          ascending: true,
        })
        .limit(3),

      supabase
        .from("social_links")
        .select(`
          id,
          name,
          url,
          icon
        `)
        .eq("is_visible", true)
        .order("display_order", {
          ascending: true,
        }),
    ])

    if (settingsResult.error) {
      console.error(
        "[content/site] Failed to load settings:",
        {
          message:
            settingsResult.error.message,
          details:
            settingsResult.error.details,
          hint:
            settingsResult.error.hint,
          code:
            settingsResult.error.code,
        },
      )
    }

    if (statsResult.error) {
      console.error(
        "[content/site] Failed to load stats:",
        {
          message:
            statsResult.error.message,
          details:
            statsResult.error.details,
          hint:
            statsResult.error.hint,
          code:
            statsResult.error.code,
        },
      )
    }

    if (socialResult.error) {
      console.error(
        "[content/site] Failed to load social links:",
        {
          message:
            socialResult.error.message,
          details:
            socialResult.error.details,
          hint:
            socialResult.error.hint,
          code:
            socialResult.error.code,
        },
      )
    }

    const settings =
      Object.fromEntries(
        (
          settingsResult.data ?? []
        ).map(
          ({ key, value }) => [
            key,
            value,
          ],
        ),
      ) as Record<string, string>

    const socialLinks =
      socialResult.data ?? []

    const linkedinUrl =
      socialLinks.find(
        (link) =>
          link.name
            .toLowerCase()
            .includes("linkedin"),
      )?.url ?? null

    const contactSettings =
      Object.fromEntries(
        [
          "contact_heading",
          "contact_description",
          "scheduling_url",
          "calendly_url",
          "scheduling_button_text",
        ]
          .filter(
            (key) =>
              settings[key] !==
              undefined,
          )
          .map((key) => [
            key,
            settings[key],
          ]),
      ) as Record<string, string>

    return {
      navigation: {
        logo:
          settings.site_logo ??
          null,

        linkedinUrl,
      },

      hero: {
        backgroundImage:
          settings.hero_background_image ??
          null,

        description:
          settings.hero_description ??
          null,
      },

      about: {
        profileImage:
          settings.about_profile_image ??
          null,

        aboutParagraph1:
          settings.about_paragraph_1 ??
          null,

        aboutParagraph2:
          settings.about_paragraph_2 ??
          null,

        aboutParagraph3:
          settings.about_paragraph_3 ??
          null,

        resumeUrl:
          settings.resume_url ??
          null,

        stats:
          statsResult.data ?? [],
      },

      contact: {
        settings:
          contactSettings,

        socialLinks,
      },
    }
  } catch (error) {
    console.error(
      "[content/site] Supabase unavailable:",
      error,
    )

    return fallback
  }
}

export async function getStatsByWorld(
  world: ContentWorld,
): Promise<QuickStat[]> {
  try {
    const supabase =
      createPublicClient()

    const { data, error } =
      await supabase
        .from("quick_stats")
        .select(`
          id,
          label,
          value
        `)
        .eq("is_visible", true)
        .eq("world", world)
        .order("display_order", {
          ascending: true,
        })

    if (error) {
      console.error(
        `[content/site] Failed to load ${world} stats:`,
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
      `[content/site] Supabase unavailable while loading ${world} stats:`,
      error,
    )

    return []
  }
}