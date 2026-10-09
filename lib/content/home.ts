import "server-only"

import {
  getFeaturedProjects,
} from "@/lib/content/projects"

import {
  getFeaturedPhotos,
  getFeaturedVideos,
} from "@/lib/content/media"

import {
  getHomeSiteContent,
} from "@/lib/content/site"

export async function getHomePageData() {
  const [
    site,
    projects,
    photos,
    videos,
  ] = await Promise.all([
    getHomeSiteContent(),
    getFeaturedProjects(),
    getFeaturedPhotos(),
    getFeaturedVideos(),
  ])

  return {
    ...site,
    projects,
    photos,
    videos,
  }
}