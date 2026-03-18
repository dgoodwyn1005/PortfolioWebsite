import Link from "next/link"

interface Company {
  name: string
  slug: string
  primary_color: string
  logo_url?: string
}

export function CompanyFooter({ company }: { company: Company }) {
  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="h-6 w-auto" />
            ) : (
              <span className="font-bold" style={{ color: company.primary_color }}>
                {company.name}
              </span>
            )}
            <span className="text-muted-foreground">| A Deshawn Goodwyn Company</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Main Site
          </Link>
        </div>
      </div>
    </footer>
  )
}
