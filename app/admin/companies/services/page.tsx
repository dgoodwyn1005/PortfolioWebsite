import { ServicesManager } from "@/components/admin/services-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function ServicesPage() {
  const { supabase } = await requireAdmin()

  const { data: companies } = await supabase.from("companies").select("id, name, slug, primary_color").order("name")

  const { data: services } = await supabase
    .from("company_services")
    .select("*, companies(name, slug)")
    .order("display_order")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Company Services</h1>
        <p className="text-muted-foreground mt-1">Manage services and pricing for each company</p>
      </div>

      <ServicesManager initialServices={services || []} companies={companies || []} />
    </div>
  )
}
