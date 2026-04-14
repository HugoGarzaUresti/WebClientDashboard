"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FolderKanbanIcon,
  type LucideIcon,
  MoonStarIcon,
  SunMediumIcon,
} from "lucide-react"

import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { useTheme } from "@/providers/theme-provider"

type PortalSidebarItem = {
  href: string
  icon: LucideIcon
  label: string
}

type PortalSidebarProps = {
  items: readonly PortalSidebarItem[]
  onNavigate?: () => void
}

export function PortalSidebar({
  items,
  onNavigate,
}: PortalSidebarProps) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme, theme } = useTheme()

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg backdrop-blur">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <FolderKanbanIcon className="size-5" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Portal
          </p>
          <h2 className="font-serif text-xl text-foreground">ClientDocs</h2>
        </div>
      </div>

      <div className="px-4 pb-4">
        <p className="px-3 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Navigation
        </p>

        <div className="mt-3 space-y-2">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm transition",
                  isActive
                    ? "border-sidebar-primary/25 bg-sidebar-primary/12 text-sidebar-foreground"
                    : "border-transparent bg-transparent text-muted-foreground hover:border-sidebar-border hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl shadow-sm",
                    isActive
                      ? "bg-card text-sidebar-primary"
                      : "bg-sidebar-accent/40 text-muted-foreground",
                  )}
                >
                  <item.icon className="size-[18px]" />
                </span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-auto space-y-4 p-4 pt-0">
        <div className="rounded-[22px] border border-sidebar-border/70 bg-sidebar-accent/30 p-4">
          <p className="text-sm font-medium text-foreground">Theme</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {theme === "system"
              ? "Following your system preference until you choose one."
              : "Saved for this browser until you switch it again."}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-sidebar-border/70 bg-card/65 p-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-sidebar-accent/40 text-foreground">
                {resolvedTheme === "dark" ? (
                  <MoonStarIcon className="size-4" />
                ) : (
                  <SunMediumIcon className="size-4" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {resolvedTheme === "dark" ? "Dark mode" : "Light mode"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Toggle your preferred theme
                </p>
              </div>
            </div>

            <Toggle
              aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              pressed={resolvedTheme === "dark"}
              onPressedChange={(pressed) => {
                setTheme(pressed ? "dark" : "light")
              }}
              variant="outline"
              size="lg"
              className="rounded-2xl px-3"
            >
              {resolvedTheme === "dark" ? (
                <MoonStarIcon className="size-4" />
              ) : (
                <SunMediumIcon className="size-4" />
              )}
              <span>{resolvedTheme === "dark" ? "Dark" : "Light"}</span>
            </Toggle>
          </div>
        </div>

        <div className="rounded-[22px] border border-sidebar-border/70 bg-sidebar-accent/30 p-4">
          <p className="text-sm font-medium text-foreground">
            Document workspace
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Upload, organize, and download everything from a single dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
