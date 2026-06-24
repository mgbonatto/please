import { getTopIssues } from "@/lib/queries";
import { IssueCard } from "@/components/issue-card";

export default async function Home() {
  const issues = await getTopIssues();

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Top Issues</h1>
        <p className="text-sm text-muted-foreground">
          The most-upvoted community issues across all spaces.
        </p>
      </header>

      {issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">No issues yet.</p>
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
