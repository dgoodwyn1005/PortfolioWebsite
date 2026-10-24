import { CompaniesManager } from "@/components/admin/companies-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function CompaniesPage() {
  const { supabase } = await requireAdmin()

  const { data: companies } = await supabase.from("companies").select("*").order("name")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Companies</h1>
        <p className="text-muted-foreground mt-1">Manage WynTech, Wynora, and other company sub-sites</p>
      </div>

      <CompaniesManager initialCompanies={companies || []} />
    </div>
  )
}
