import { TestimonialsManager } from "@/components/admin/testimonials-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function TestimonialsPage() {
  const { supabase } = await requireAdmin()

  const { data: companies } = await supabase.from("companies").select("id, name, slug").order("name")

  const { data: testimonials } = await supabase
    .from("company_testimonials")
    .select("*, companies(name)")
    .order("created_at", { ascending: false })

  // Count pending testimonials
  const pendingCount = testimonials?.filter((t) => t.status === "pending").length || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
        <p className="text-muted-foreground mt-1">
          Manage client testimonials for each company
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              {pendingCount} pending review
            </span>
          )}
        </p>
      </div>

      <TestimonialsManager initialTestimonials={testimonials || []} companies={companies || []} />
    </div>
  )
}
