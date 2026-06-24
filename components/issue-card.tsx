import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SpaceBadge } from "@/components/space-badge"
import type { IssueWithSpace } from "@/lib/types"

export function IssueCard({ issue }: { issue: IssueWithSpace }) {
  return (
    <Card className="transition-colors hover:bg-muted/40">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <SpaceBadge slug={issue.space.slug} name={issue.space.name} category={issue.space.category} />
          <span className="shrink-0 text-sm text-muted-foreground" title="upvotes">
            ▲ {issue.upvote_count}
          </span>
        </div>
        <CardTitle>
          <Link href={`/issues/${issue.id}?s=${issue.space.slug}`} className="hover:underline">
            {issue.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{issue.description}</p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">
          {issue.proposal_count} {issue.proposal_count === 1 ? "proposal" : "proposals"}
        </span>
      </CardFooter>
    </Card>
  )
}
