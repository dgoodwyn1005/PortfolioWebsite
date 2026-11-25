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
  // Reject failed regeneration rather than replacing the last good ISR page.
  const [
    site,
    projects,
    photos,
    videos,
  ] = await Promise.all([
    getHomeSiteContent(true),
    getFeaturedProjects(true),
    getFeaturedPhotos(true),
    getFeaturedVideos(true),
  ])

  return {
    ...site,
    projects,
    photos,
    videos,
  }
}