"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DigitalProductsManager } from "@/components/admin/digital-products-manager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Company {
  id: string
  name: string
  slug: string
}

export default function DigitalProductsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")

  useEffect(() => {
    async function fetchCompanies() {
      const supabase = createClient()
      const { data } = await supabase.from("companies").select("id, name, slug").order("name")
      if (data) {
        setCompanies(data)
        // Default to Wynora if available
        const wynora = data.find((c) => c.slug === "wynora")
        if (wynora) {
          setSelectedCompanyId(wynora.id)
        } else if (data.length > 0) {
          setSelectedCompanyId(data[0].id)
        }
      }
    }
    fetchCompanies()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label>Select Company</Label>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCompanyId && <DigitalProductsManager companyId={selectedCompanyId} />}
    </div>
  )
}
