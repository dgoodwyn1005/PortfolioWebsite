import { VideosManager } from "@/components/admin/videos-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function VideosPage() {
  const { supabase } = await requireAdmin()

  const { data: videos } = await supabase.from("videos").select("*").order("section").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Videos</h1>
        <p className="text-muted-foreground mt-1">Manage YouTube videos for music and basketball sections.</p>
      </div>
      <VideosManager initialVideos={videos || []} />
    </div>
  )
}
