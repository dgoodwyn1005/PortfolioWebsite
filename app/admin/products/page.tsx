import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProductsManager } from "@/components/admin/products-manager"

export default async function ProductsAdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.user_metadata?.is_admin) {
    redirect("/admin/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Shop Products</h1>
        <p className="text-muted-foreground">Manage products and services available in your shop</p>
      </div>

      <ProductsManager />
    </div>
  )
}
