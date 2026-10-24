import { TeamManager } from "@/components/admin/team-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function TeamPage() {
  const { supabase } = await requireAdmin()

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name")

  const { data: team } = await supabase.from("company_team").select("*, companies(name)").order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
        <p className="text-muted-foreground mt-1">Manage team members for each company</p>
      </div>

      <TeamManager initialTeam={team || []} companies={companies || []} />
    </div>
  )
}
