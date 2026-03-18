import { SilentPianistManager } from "@/components/admin/silent-pianist-manager"

export default function SilentPianistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">The Silent Pianist Videos</h1>
        <p className="text-muted-foreground">Manage videos for The Silent Pianist section</p>
      </div>
      <SilentPianistManager />
    </div>
  )
}
