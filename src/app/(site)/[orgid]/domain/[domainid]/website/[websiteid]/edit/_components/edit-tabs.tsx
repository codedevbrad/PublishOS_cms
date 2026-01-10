"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"

interface EditTabsProps {
  basePath: string
}

export function EditTabs({ basePath }: EditTabsProps) {
  const pathname = usePathname()

  const tabs = [
    { label: "Design", href: `${basePath}/design` },
    { label: "Data", href: `${basePath}/data` },
    { label: "Chat system", href: `${basePath}/chat` },
    { label: "Analytics", href: `${basePath}/analytics` },
  ]

  return (
    <div className="flex items-center gap-1 px-6 py-2">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href === `${basePath}/design` && pathname === basePath)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors rounded-md",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
