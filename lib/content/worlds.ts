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

export async function getBuildPageData() {
  const [
    site,
    projects,
    wyntech,
  ] = await Promise.all([
    getHomeSiteContent(true),
    getProjectsByWorld("build", true),
    getCompanyPageData("wyntech", true),
  ])

  return {
    navigation:
      site.navigation,

    projects,

    wyntech,
  }
}

export async function getMusicPageData() {
  const [
    site,
    videos,
    wynora,
  ] = await Promise.all([
    getHomeSiteContent(true),
    getVideosByWorld("music", true),
    getCompanyPageData("wynora", true),
  ])

  const wynoraMedia =
    wynora
      ? await getWynoraMediaData(
          wynora.company.id,
          true,
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
    getHomeSiteContent(true),
    getPhotosByWorld("life", true),
    getStatsByWorld("life", true),
  ])

  return {
    navigation:
      site.navigation,

    photos,
    stats,
  }
}