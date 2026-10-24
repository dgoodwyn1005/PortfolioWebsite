"use client"

import { useReducedMotion } from "@/lib/use-reduced-motion"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"
import {
  usePathname,
} from "next/navigation"

import {
  AnimatePresence,
  motion,
} from "framer-motion"

import {
  ArrowUpRight,
  Linkedin,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react"

import {
  useTheme,
} from "next-themes"

const navLinks = [
  {
    name: "Build",
    href: "/build",
    description:
      "Technology, products & ventures",
  },
  {
    name: "Music",
    href: "/music",
    description:
      "Piano, performance & creation",
  },
  {
    name: "Life",
    href: "/life",
    description:
      "Athletics, story & experience",
  },
  {
    name: "Work",
    href: "/#projects",
    description:
      "Selected projects & case studies",
  },
]

interface NavbarProps {
  logo?: string | null
  linkedinUrl?: string | null
}

export function Navbar({
  logo = null,
  linkedinUrl = null,
}: NavbarProps) {
  const pathname = usePathname()

  const {
    resolvedTheme,
    setTheme,
  } = useTheme()

  const shouldReduceMotion =
    useReducedMotion()

  const [isOpen, setIsOpen] =
    useState(false)

  const [scrolled, setScrolled] =
    useState(false)

  const [mounted, setMounted] =
    useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 24,
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

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      )
    }
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

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

  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark",
    )
  }

  return (
    <motion.header
      initial={
        shouldReduceMotion
          ? false
          : {
              y: -80,
              opacity: 0,
            }
      }
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration:
          shouldReduceMotion
            ? 0
            : 0.5,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className={[
        "fixed inset-x-0 top-0 z-50",
        "transition-[background-color,border-color,backdrop-filter] duration-300",

        scrolled || isOpen
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          aria-label="Deshawn Goodwyn — Home"
          className="relative z-50 flex min-h-11 items-center gap-3"
        >
          {logo ? (
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="font-semibold tracking-[-0.04em] text-foreground">
              DG
            </span>
          )}

          <span className="hidden text-sm font-medium tracking-tight text-foreground sm:block">
            Deshawn Goodwyn
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map(
            (link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {link.name}
              </Link>
            ),
          )}

          <div
            aria-hidden="true"
            className="mx-2 h-5 w-px bg-border"
          />

          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Deshawn Goodwyn on LinkedIn"
              className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <Linkedin className="size-4" />
            </a>
          )}

          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                resolvedTheme ===
                "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {resolvedTheme ===
              "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
          )}

          <Link
            href="/#contact"
            className="ml-2 inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
          >
            Work With Me
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="relative z-50 flex items-center gap-1 lg:hidden">
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                resolvedTheme ===
                "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {resolvedTheme ===
              "dark" ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              setIsOpen(
                (current) =>
                  !current,
              )
            }
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={
              isOpen
                ? "Close navigation"
                : "Open navigation"
            }
            className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          >
            {isOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={
              shouldReduceMotion
                ? {
                    opacity: 1,
                  }
                : {
                    opacity: 0,
                    y: -12,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={
              shouldReduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    y: -12,
                  }
            }
            transition={{
              duration:
                shouldReduceMotion
                  ? 0
                  : 0.25,
            }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-background lg:hidden"
          >
            <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 pb-8 pt-6 sm:px-6">
              <div className="flex-1">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Explore
                </p>

                <div className="divide-y divide-border/60 border-y border-border/60">
                  {navLinks.map(
                    (
                      link,
                      index,
                    ) => (
                      <motion.div
                        key={
                          link.name
                        }
                        initial={
                          shouldReduceMotion
                            ? false
                            : {
                                opacity: 0,
                                y: 12,
                              }
                        }
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay:
                            shouldReduceMotion
                              ? 0
                              : 0.04 *
                                index,
                        }}
                      >
                        <Link
                          href={
                            link.href
                          }
                          onClick={() =>
                            setIsOpen(
                              false,
                            )
                          }
                          className="group flex min-h-20 items-center justify-between gap-4 py-4"
                        >
                          <div>
                            <span className="block text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                              {
                                link.name
                              }
                            </span>

                            <span className="mt-1 block text-sm text-muted-foreground">
                              {
                                link.description
                              }
                            </span>
                          </div>

                          <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href="/#contact"
                  onClick={() =>
                    setIsOpen(false)
                  }
                  className="flex min-h-14 w-full items-center justify-between rounded-full bg-foreground px-6 text-base font-medium text-background"
                >
                  Work With Me
                  <ArrowUpRight className="size-5" />
                </Link>

                {linkedinUrl && (
                  <a
                    href={
                      linkedinUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      setIsOpen(
                        false,
                      )
                    }
                    className="flex min-h-14 w-full items-center gap-3 rounded-full border border-border px-6 text-sm text-muted-foreground"
                  >
                    <Linkedin className="size-5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
