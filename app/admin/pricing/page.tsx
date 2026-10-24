import { PricingManager } from "@/components/admin/pricing-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function PricingPage() {
  const { supabase } = await requireAdmin()

  const { data: pricing } = await supabase.from("pricing").select("*").order("service_type")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pricing</h1>
        <p className="text-muted-foreground mt-1">Manage your service rates and booking links.</p>
      </div>
      <PricingManager initialPricing={pricing || []} />
    </div>
  )
}
