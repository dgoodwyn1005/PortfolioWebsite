import { PortfolioManager } from "@/components/admin/portfolio-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function PortfolioPage() {
  const { supabase } = await requireAdmin()

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name")

  const { data: portfolio } = await supabase
    .from("company_portfolio")
    .select("*, companies(name)")
    .order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted-foreground mt-1">Manage work samples and case studies for each company</p>
      </div>

      <PortfolioManager initialPortfolio={portfolio || []} companies={companies || []} />
    </div>
  )
}
