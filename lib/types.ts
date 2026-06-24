// lib/types.ts — hand-written types for the M2 read model.
// (Supabase CLI type generation is adopted in M3.)

export type SpaceStatus = "approved" | "under_review" | "rejected";
export type SpaceCategory = "games";
export type LinkSourceType =
  | "reddit" | "forum" | "discord" | "official" | "video" | "article" | "other";

export interface Space {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  status: SpaceStatus;
  created_at: string;
}

export interface LinkRow {
  id: string;
  url: string;
  title: string | null;
  source_type: LinkSourceType | null;
  created_at: string;
}

export interface Issue {
  id: string;
  space_id: string;
  title: string;
  description: string;
  upvote_count: number;
  created_by: string | null;
  created_at: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  upvote_count: number;
  created_by: string | null;
  created_at: string;
}

// --- View models the pages consume ---------------------------------------

/** An issue plus the bits of its space needed for a card, and its proposal count. */
export interface IssueWithSpace extends Issue {
  space: Pick<Space, "id" | "slug" | "name" | "category">;
  proposal_count: number;
}

/** A proposal shown inside an issue: its links + the OTHER issues it also addresses. */
export interface ProposalWithContext extends Proposal {
  links: LinkRow[];
  also_addresses: Array<Pick<Issue, "id" | "title">>;
}

/** Full issue detail page payload. */
export interface IssueDetail extends Issue {
  space: Space;
  links: LinkRow[];
  proposals: ProposalWithContext[];
}
