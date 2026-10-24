import { ProductsManager } from "@/components/admin/products-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function ProductsAdminPage() {
  await requireAdmin()

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
