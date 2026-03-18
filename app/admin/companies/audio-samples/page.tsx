import { AudioSamplesManager } from "@/components/admin/audio-samples-manager"

export default function AudioSamplesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audio Samples</h1>
        <p className="text-muted-foreground">Manage audio samples for company service tiers</p>
      </div>
      <AudioSamplesManager />
    </div>
  )
}
