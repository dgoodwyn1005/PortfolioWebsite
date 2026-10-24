import { ProjectsManager } from "@/components/admin/projects-manager"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function ProjectsPage() {
  const { supabase } = await requireAdmin()

  const { data: projects } = await supabase.from("projects").select("*").order("display_order")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
      </div>
      <ProjectsManager initialProjects={projects || []} />
    </div>
  )
}
