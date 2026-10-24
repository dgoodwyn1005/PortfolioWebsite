import { SocialLinksManager } from "@/components/admin/social-links-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function SocialLinksPage() {
  const { supabase } = await requireAdmin()

  const { data: links } = await supabase.from("social_links").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Social Links</h1>
        <p className="text-muted-foreground mt-1">Manage your social media and contact links.</p>
      </div>
      <SocialLinksManager initialLinks={links || []} />
    </div>
  )
}
