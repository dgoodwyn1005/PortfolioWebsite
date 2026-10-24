import { StatsManager } from "@/components/admin/stats-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function StatsPage() {
  const { supabase } = await requireAdmin()

  const { data: stats } = await supabase.from("quick_stats").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quick Stats</h1>
        <p className="text-muted-foreground mt-1">Manage the stats shown in your about section.</p>
      </div>
      <StatsManager initialStats={stats || []} />
    </div>
  )
}
