import type { LinkRow } from "@/lib/types"

const SOURCE_LABELS: Record<string, string> = {
  reddit: "Reddit",
  forum: "Forum",
  discord: "Discord",
  official: "Official",
  video: "Video",
  article: "Article",
  other: "Link",
}

export function LinkList({ links }: { links: LinkRow[] }) {
  if (links.length === 0) return null
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.id} className="text-sm">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {link.title ?? link.url}
          </a>
          {link.source_type ? (
            <span className="ml-2 text-xs text-muted-foreground">
              {SOURCE_LABELS[link.source_type] ?? "Link"}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
