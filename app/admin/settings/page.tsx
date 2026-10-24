import { SettingsForm } from "@/components/admin/settings-form"
import { requireAdmin } from "@/lib/admin/require-admin"

export default async function SettingsPage() {
  const { supabase } = await requireAdmin()

  const { data: settings } = await supabase.from("site_settings").select("*").order("key")

  // Convert to key-value object
  const settingsMap: Record<string, string> = {}
  settings?.forEach((s) => {
    settingsMap[s.key] = s.value
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
        <p className="text-muted-foreground mt-1">
          Edit the text content, colors, and branding displayed on your portfolio.
        </p>
      </div>
      <SettingsForm settings={settingsMap} />
    </div>
  )
}
