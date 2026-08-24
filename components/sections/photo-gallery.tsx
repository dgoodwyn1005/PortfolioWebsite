import { createClient } from "@/lib/supabase/server"
import { PhotoGalleryClient } from "@/components/photo-gallery-client"

export async function PhotoGallerySection() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from("photo_gallery")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true })

  if (!photos || photos.length === 0) {
    return null
  }

  return (
    <section id="gallery" className="py-14 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A glimpse into my world</p>
        </div>

        <PhotoGalleryClient photos={photos} />
      </div>
    </section>
  )
}
