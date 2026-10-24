import { InvoiceCreator } from "@/components/admin/invoice-creator"

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operate / Invoices</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">Create invoice</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Turn completed or approved work into a clean payment handoff without leaving the operating system.
        </p>
      </div>
      <InvoiceCreator />
    </div>
  )
}
