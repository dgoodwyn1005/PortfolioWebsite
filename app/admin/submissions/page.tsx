import { SubmissionsManager } from "@/components/admin/submissions-manager"

export default function SubmissionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operate / Leads</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Lead pipeline</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Keep every serious inquiry moving from first contact to a clear outcome while preserving the history that makes future decisions better.
        </p>
      </div>
      <SubmissionsManager />
    </div>
  )
}
