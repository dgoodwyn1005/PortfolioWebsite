import { PhotoGalleryClient } from "@/components/photo-gallery-client"

import type {
  Photo,
} from "@/lib/content/media"

interface PhotoGallerySectionProps {
  photos: Photo[]
}

export function PhotoGallerySection({
  photos,
}: PhotoGallerySectionProps) {
  if (!photos.length) {
    return null
  }

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-20 border-t border-border/60 py-16 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 sm:mb-14 lg:mb-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              03 / Selected Frames
            </p>
          </div>

          <div className="lg:col-span-8">
            <h2
              id="gallery-heading"
              className="max-w-3xl text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl"
            >
              Different rooms. Same
              story.
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A few moments across
              athletics, music, work,
              and everything in between.
            </p>
          </div>
        </div>

        <PhotoGalleryClient
          photos={photos}
        />
      </div>
    </section>
  )
}