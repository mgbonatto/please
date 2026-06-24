import { notFound } from "next/navigation";
import { getSpaceBySlug } from "@/lib/queries";
import { categoryLabel } from "@/lib/categories";
import { IssueCard } from "@/components/issue-card";

export default async function SpacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getSpaceBySlug(slug);
  if (!result) notFound();
  const { space, issues } = result;

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {categoryLabel(space.category)}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{space.name}</h1>
        {space.description ? (
          <p className="text-sm text-muted-foreground">{space.description}</p>
        ) : null}
      </header>

      {issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">No issues in this space yet.</p>
      ) : (
        <ul className="space-y-3">
          {issues.map((issue) => (
            <li key={issue.id}>
              <IssueCard issue={issue} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
