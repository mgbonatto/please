// lib/queries.ts — read-only data access for M2.
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Space,
  Issue,
  Proposal,
  LinkRow,
  IssueWithSpace,
  IssueDetail,
  ProposalWithContext,
} from "@/lib/types";

type SupabaseClient = NonNullable<ReturnType<typeof getSupabaseServerClient>>;

/** Approved spaces for the nav + directory, alphabetical. */
export async function getApprovedSpaces(): Promise<Space[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("status", "approved")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Space[];
}

/** Global Top Issues across approved spaces, highest upvotes first. */
export async function getTopIssues(limit = 50): Promise<IssueWithSpace[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("issues")
    .select(
      "id, space_id, title, description, upvote_count, created_by, created_at, " +
        "spaces!inner ( id, slug, name, category, status ), " +
        "issue_proposals ( proposal_id )"
    )
    .eq("spaces.status", "approved")
    .order("upvote_count", { ascending: false })
    .limit(limit);
  if (error) throw error;

  type Row = Issue & {
    spaces: Pick<Space, "id" | "slug" | "name" | "category">;
    issue_proposals: { proposal_id: string }[];
  };
  return (data as unknown as Row[]).map((r) => ({
    id: r.id,
    space_id: r.space_id,
    title: r.title,
    description: r.description,
    upvote_count: r.upvote_count,
    created_by: r.created_by,
    created_at: r.created_at,
    space: r.spaces,
    proposal_count: r.issue_proposals?.length ?? 0,
  }));
}

/** A space (by slug) plus its issues, highest upvotes first. Null if not found/approved. */
export async function getSpaceBySlug(
  slug: string
): Promise<{ space: Space; issues: IssueWithSpace[] } | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data: space, error: spaceErr } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .eq("status", "approved")
    .maybeSingle();
  if (spaceErr) throw spaceErr;
  if (!space) return null;

  const { data: issuesData, error: issuesErr } = await supabase
    .from("issues")
    .select(
      "id, space_id, title, description, upvote_count, created_by, created_at, " +
        "issue_proposals ( proposal_id )"
    )
    .eq("space_id", space.id)
    .order("upvote_count", { ascending: false });
  if (issuesErr) throw issuesErr;

  type Row = Issue & { issue_proposals: { proposal_id: string }[] };
  const issues: IssueWithSpace[] = (issuesData as unknown as Row[]).map((r) => ({
    id: r.id,
    space_id: r.space_id,
    title: r.title,
    description: r.description,
    upvote_count: r.upvote_count,
    created_by: r.created_by,
    created_at: r.created_at,
    space: {
      id: (space as Space).id,
      slug: (space as Space).slug,
      name: (space as Space).name,
      category: (space as Space).category,
    },
    proposal_count: r.issue_proposals?.length ?? 0,
  }));

  return { space: space as Space, issues };
}

async function linksForIssue(supabase: SupabaseClient, issueId: string): Promise<LinkRow[]> {
  const { data, error } = await supabase
    .from("issue_links")
    .select("links ( id, url, title, source_type, created_at )")
    .eq("issue_id", issueId);
  if (error) throw error;
  return ((data ?? []) as unknown as { links: LinkRow }[]).map((r) => r.links);
}

async function linksForProposal(supabase: SupabaseClient, proposalId: string): Promise<LinkRow[]> {
  const { data, error } = await supabase
    .from("proposal_links")
    .select("links ( id, url, title, source_type, created_at )")
    .eq("proposal_id", proposalId);
  if (error) throw error;
  return ((data ?? []) as unknown as { links: LinkRow }[]).map((r) => r.links);
}

async function otherIssuesForProposal(
  supabase: SupabaseClient,
  proposalId: string,
  excludeIssueId: string
): Promise<Array<Pick<Issue, "id" | "title">>> {
  const { data, error } = await supabase
    .from("issue_proposals")
    .select("issues ( id, title )")
    .eq("proposal_id", proposalId)
    .neq("issue_id", excludeIssueId);
  if (error) throw error;
  return ((data ?? []) as unknown as { issues: Pick<Issue, "id" | "title"> }[]).map((r) => r.issues);
}

/** Full Issue page payload: issue + space + links + proposals (each with links & also-addresses). */
export async function getIssueById(id: string): Promise<IssueDetail | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return null;

  const { data: issue, error: issueErr } = await supabase
    .from("issues")
    .select("*, spaces ( id, slug, name, category, description, status, created_at )")
    .eq("id", id)
    .maybeSingle();
  if (issueErr) throw issueErr;
  if (!issue) return null;

  const issueLinks = await linksForIssue(supabase, id);

  const { data: ip, error: ipErr } = await supabase
    .from("issue_proposals")
    .select("proposals ( id, title, description, upvote_count, created_by, created_at )")
    .eq("issue_id", id);
  if (ipErr) throw ipErr;

  const proposals: ProposalWithContext[] = [];
  for (const row of (ip ?? []) as unknown as { proposals: Proposal }[]) {
    const p = row.proposals;
    proposals.push({
      ...p,
      links: await linksForProposal(supabase, p.id),
      also_addresses: await otherIssuesForProposal(supabase, p.id, id),
    });
  }
  proposals.sort((a, b) => b.upvote_count - a.upvote_count);

  const issueRow = issue as unknown as Issue & { spaces: Space };
  return {
    id: issueRow.id,
    space_id: issueRow.space_id,
    title: issueRow.title,
    description: issueRow.description,
    upvote_count: issueRow.upvote_count,
    created_by: issueRow.created_by,
    created_at: issueRow.created_at,
    space: issueRow.spaces,
    links: issueLinks,
    proposals,
  };
}
