import Link from "next/link"

const footerLinks = [
  {
    name: "Build",
    href: "/wyntech",
  },
  {
    name: "Music",
    href: "/wynora",
  },
  {
    name: "Life",
    href: "/#about",
  },
  {
    name: "Work",
    href: "/#projects",
  },
  {
    name: "Work With Me",
    href: "/#contact",
  },
]

export function Footer() {
  const year =
    new Date().getFullYear()

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link
              href="/"
              className="inline-block"
            >
              <p className="text-3xl font-medium leading-none tracking-[-0.05em] text-foreground sm:text-4xl">
                Deshawn Goodwyn
              </p>
            </Link>

            <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Build · Music · Life
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:justify-items-end">
              {footerLinks.map(
                (link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="min-h-10 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ),
              )}
            </div>
          </nav>
        </div>

        <div className="mt-12 border-t border-border/60 pt-6 sm:mt-16">
          <p className="text-xs text-muted-foreground">
            © {year} Deshawn
            Goodwyn.
          </p>
        </div>
      </div>
    </footer>
  )
}