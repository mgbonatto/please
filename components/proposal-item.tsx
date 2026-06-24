import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkList } from "@/components/link-list"
import type { ProposalWithContext } from "@/lib/types"

export function ProposalItem({
  proposal,
  spaceSlug,
}: {
  proposal: ProposalWithContext
  spaceSlug: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle>{proposal.title}</CardTitle>
          <span className="shrink-0 text-sm text-muted-foreground" title="upvotes">
            ▲ {proposal.upvote_count}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{proposal.description}</p>

        {proposal.also_addresses.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Also addresses:{" "}
            {proposal.also_addresses.map((other, i) => (
              <span key={other.id}>
                {i > 0 ? ", " : ""}
                <Link href={`/issues/${other.id}?s=${spaceSlug}`} className="text-primary hover:underline">
                  {other.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        {proposal.links.length > 0 ? (
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Links</p>
            <LinkList links={proposal.links} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
