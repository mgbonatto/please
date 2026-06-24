import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { categoryLabel } from "@/lib/categories"

export function SpaceBadge({
  slug,
  name,
  category,
}: {
  slug: string
  name: string
  category: string
}) {
  return (
    <Link href={`/spaces/${slug}`} className="hover:opacity-80">
      <Badge variant="secondary">
        <span className="text-muted-foreground">{categoryLabel(category)}</span>
        <span>{name}</span>
      </Badge>
    </Link>
  )
}
