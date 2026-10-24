import "server-only"

import {
  getProjectsByWorld,
} from "@/lib/content/projects"

import {
  getPhotosByWorld,
  getVideosByWorld,
} from "@/lib/content/media"

import {
  getHomeSiteContent,
  getStatsByWorld,
} from "@/lib/content/site"

import {
  getCompanyPageData,
  getWynoraMediaData,
} from "@/lib/content/companies"

function prioritizeFlagshipProject<
  T extends { title: string },
>(projects: T[]) {
  return [...projects].sort(
    (a, b) => {
      const aIsFlagship =
        a.title
          .trim()
          .toLowerCase() ===
        "sonisphere"
      const bIsFlagship =
        b.title
          .trim()
          .toLowerCase() ===
        "sonisphere"

      if (
        aIsFlagship ===
        bIsFlagship
      ) {
        return 0
      }

      return aIsFlagship
        ? -1
        : 1
    },
  )
}

export async function getBuildPageData() {
  const [
    site,
    projects,
    wyntech,
  ] = await Promise.all([
    getHomeSiteContent(),
    getProjectsByWorld("build"),
    getCompanyPageData("wyntech"),
  ])

  return {
    navigation:
      site.navigation,

    // Keep the durable Build world broad, but make the strongest
    // product expression visibly lead the portfolio hierarchy.
    projects:
      prioritizeFlagshipProject(
        projects,
      ),

    wyntech,
  }
}

export async function getMusicPageData() {
  const [
    site,
    videos,
    wynora,
  ] = await Promise.all([
    getHomeSiteContent(),
    getVideosByWorld("music"),
    getCompanyPageData("wynora"),
  ])

  const wynoraMedia =
    wynora
      ? await getWynoraMediaData(
          wynora.company.id,
        )
      : {
          audioClips: [],
          silentPianistVideos: [],
          audioSamples: [],
          musicVideos: [],
        }

  return {
    navigation:
      site.navigation,

    videos:
      videos.length
        ? videos
        : wynoraMedia.musicVideos,

    wynora,

    audioSamples:
      wynoraMedia.audioSamples,

    audioClips:
      wynoraMedia.audioClips,
  }
}

export async function getLifePageData() {
  const [
    site,
    photos,
    stats,
  ] = await Promise.all([
    getHomeSiteContent(),
    getPhotosByWorld("life"),
    getStatsByWorld("life"),
  ])

  return {
    navigation:
      site.navigation,

    photos,
    stats,
  }
}