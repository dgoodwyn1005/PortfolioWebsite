"use client"

import { useEffect, useState } from "react"

import { createClient } from "@/lib/supabase/client"
import { DigitalProductsManager } from "@/components/admin/digital-products-manager"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"

interface Company {
  id: string
  name: string
  slug: string
}

export default function DigitalProductsPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState("")

  useEffect(() => {
    async function fetchCompanies() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("companies")
        .select("id, name, slug")
        .order("name", { ascending: true })

      if (error) {
        console.error("Failed to load companies:", error)
        return
      }

      const companyData = (data ?? []) as Company[]

      setCompanies(companyData)

      // Default to Wynora if available.
      const wynora = companyData.find(
        (company) => company.slug === "wynora",
      )

      if (wynora) {
        setSelectedCompanyId(wynora.id)
        return
      }

      if (companyData.length > 0) {
        setSelectedCompanyId(companyData[0].id)
      }
    }

    void fetchCompanies()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label htmlFor="company-select">
            Select Company
          </Label>

          <Select
            value={selectedCompanyId}
            onValueChange={setSelectedCompanyId}
          >
            <SelectTrigger
              id="company-select"
              className="w-[200px]"
            >
              <SelectValue placeholder="Select company" />
            </SelectTrigger>

            <SelectContent>
              {companies.map((company) => (
                <SelectItem
                  key={company.id}
                  value={company.id}
                >
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedCompanyId && (
        <DigitalProductsManager
          companyId={selectedCompanyId}
        />
      )}
    </div>
  )
}