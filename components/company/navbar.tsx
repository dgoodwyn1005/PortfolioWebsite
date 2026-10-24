"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import {
  ArrowLeft,
  ArrowUpRight,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react"

import {
  useTheme,
} from "next-themes"

import {
  Button,
} from "@/components/ui/button"

interface Company {
  id: string
  slug: string
  name: string
  primary_color: string
  logo_url?: string
}

const navLinks = [
  {
    name: "About",
    href: "#about",
  },
  {
    name: "Services",
    href: "#services",
  },
  {
    name: "Work",
    href: "#portfolio",
  },
  {
    name: "Testimonials",
    href: "#testimonials",
  },
]

export function CompanyNavbar({
  company,
}: {
  company: Company
}) {
  const [isOpen, setIsOpen] =
    useState(false)

  const [scrolled, setScrolled] =
    useState(false)

  const {
    resolvedTheme,
    setTheme,
  } = useTheme()

  const [mounted, setMounted] =
    useState(false)

  const shouldReduceMotion =
    useReducedMotion()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(
        window.scrollY > 50,
      )
    }

    handleScroll()

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    )

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll,
      )
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      )
    }
  }, [isOpen])

  const commercialLabel =
    company.slug === "wynora"
      ? "Request Booking"
      : "Start a Project"

  const worldHref =
    company.slug === "wynora"
      ? "/music"
      : "/build"

  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark",
    )
  }

  return (
    <motion.nav
      initial={
        shouldReduceMotion
          ? false
          : {
              y: -100,
            }
      }
      animate={{
        y: 0,
      }}
      transition={{
        duration:
          shouldReduceMotion
            ? 0
            : 0.45,
      }}
      aria-label={`${company.name} navigation`}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || isOpen
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "",
      ].join(" ")}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={worldHref}
              aria-label={`Back to ${
                company.slug ===
                "wynora"
                  ? "Music"
                  : "Build"
              }`}
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <ArrowLeft className="size-5" />
            </Link>

            <Link
              href={`/${company.slug}`}
              className="flex min-w-0 items-center gap-2"
            >
              {company.logo_url ? (
                <img
                  src={
                    company.logo_url
                  }
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-auto max-w-32 object-contain"
                />
              ) : (
                <span
                  className="truncate text-lg font-bold"
                  style={{
                    color:
                      company.primary_color,
                  }}
                >
                  {company.name}
                </span>
              )}
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(
              (link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {link.name}
                </a>
              ),
            )}

            {mounted && (
              <button
                type="button"
                onClick={
                  toggleTheme
                }
                aria-label={
                  resolvedTheme ===
                  "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                className="ml-1 flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {resolvedTheme ===
                "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            )}

            <a
              href="#contact"
              className="ml-2 inline-flex min-h-10 items-center gap-2 rounded-full px-5 text-sm font-medium text-white transition-opacity hover:opacity-85"
              style={{
                backgroundColor:
                  company.primary_color,
              }}
            >
              {commercialLabel}

              <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <a href="#contact" className="inline-flex min-h-11 items-center rounded-full bg-foreground px-3 text-xs font-medium text-background">
              {commercialLabel}
            </a>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={
                  toggleTheme
                }
                aria-label={
                  resolvedTheme ===
                  "dark"
                    ? "Switch to light theme"
                    : "Switch to dark theme"
                }
                className="hidden size-11 min-[400px]:inline-flex"
              >
                {resolvedTheme ===
                "dark" ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setIsOpen(
                  (current) =>
                    !current,
                )
              }
              aria-expanded={isOpen}
              aria-controls="company-mobile-navigation"
              aria-label={
                isOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              className="size-11"
            >
              {isOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="company-mobile-navigation"
            initial={
              shouldReduceMotion
                ? {
                    opacity: 1,
                  }
                : {
                    opacity: 0,
                    height: 0,
                  }
            }
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration:
                shouldReduceMotion
                  ? 0
                  : 0.2,
            }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="space-y-2 px-4 pb-6 pt-3">
              {navLinks.map(
                (link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() =>
                      setIsOpen(
                        false,
                      )
                    }
                    className="block min-h-11 py-3 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </a>
                ),
              )}

              <a
                href="#contact"
                onClick={() =>
                  setIsOpen(false)
                }
                className="mt-4 flex min-h-14 w-full items-center justify-between rounded-full px-6 text-base font-medium text-white"
                style={{
                  backgroundColor:
                    company.primary_color,
                }}
              >
                {
                  commercialLabel
                }

                <ArrowUpRight className="size-5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
