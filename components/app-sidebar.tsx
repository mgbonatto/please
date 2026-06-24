"use client"

import { useState } from "react"
import Link from "next/link"

type NavSpace = { slug: string; name: string }

export function AppSidebar({ spaces }: { spaces: NavSpace[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-3 top-3 z-30 rounded-md border border-border bg-background px-3 py-1.5 text-sm md:hidden"
        aria-expanded={open}
        aria-controls="app-sidebar"
      >
        ☰ Menu
      </button>

      <aside
        id="app-sidebar"
        className={`${
          open ? "block" : "hidden"
        } fixed inset-y-0 left-0 z-20 w-60 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground md:block`}
      >
        <Link href="/" className="block text-lg font-semibold" onClick={() => setOpen(false)}>
          Please
        </Link>
        <nav className="mt-6 space-y-4 text-sm">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            Top Issues
          </Link>
          <div>
            <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Spaces
            </p>
            <ul className="mt-1 space-y-0.5">
              {spaces.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/spaces/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  )
}
