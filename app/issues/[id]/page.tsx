import Link from "next/link";
import { notFound } from "next/navigation";
import { getIssueById } from "@/lib/queries";
import { categoryLabel } from "@/lib/categories";
import { LinkList } from "@/components/link-list";
import { ProposalItem } from "@/components/proposal-item";

export default async function IssuePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ s?: string }>;
}) {
  const { id } = await params;
  await searchParams; // `?s=` is optional breadcrumb context; the page works without it
  const issue = await getIssueById(id);
  if (!issue) notFound();

  return (
    <article className="space-y-8">
      <nav className="text-sm">
        <Link href={`/spaces/${issue.space.slug}`} className="text-primary hover:underline">
          ← {categoryLabel(issue.space.category)}: {issue.space.name}
        </Link>
      </nav>

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{issue.title}</h1>
          <span className="shrink-0 text-sm text-muted-foreground" title="upvotes">
            ▲ {issue.upvote_count}
          </span>
        </div>
        <p className="text-muted-foreground">{issue.description}</p>
        {issue.links.length > 0 ? (
          <div className="pt-2">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Links</p>
            <LinkList links={issue.links} />
          </div>
        ) : null}
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">
          Proposals{" "}
          <span className="text-sm text-muted-foreground">({issue.proposals.length})</span>
        </h2>
        {issue.proposals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No proposals yet.</p>
        ) : (
          <ul className="space-y-3">
            {issue.proposals.map((proposal) => (
              <li key={proposal.id}>
                <ProposalItem proposal={proposal} spaceSlug={issue.space.slug} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
