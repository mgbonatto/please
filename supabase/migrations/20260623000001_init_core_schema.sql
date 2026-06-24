-- 20260623000001_init_core_schema.sql
-- M2 core schema: spaces, issues, proposals, their M2M joins, and links.
-- Read-only public access (RLS SELECT-only). Writing arrives in later milestones.

-- 1. spaces ---------------------------------------------------------------
create table if not exists public.spaces (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  category    text not null default 'games',
  description text,
  status      text not null default 'approved'
              check (status in ('approved','under_review','rejected')),
  created_at  timestamptz not null default now()
);

-- 2. issues ---------------------------------------------------------------
create table if not exists public.issues (
  id           uuid primary key default gen_random_uuid(),
  space_id     uuid not null references public.spaces(id) on delete cascade,
  title        text not null,
  description  text not null,
  upvote_count integer not null default 0,
  created_by   uuid,
  created_at   timestamptz not null default now()
);

-- 3. proposals ------------------------------------------------------------
create table if not exists public.proposals (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null,
  upvote_count integer not null default 0,
  created_by   uuid,
  created_at   timestamptz not null default now()
);

-- 4. issue_proposals (M2M) ------------------------------------------------
create table if not exists public.issue_proposals (
  issue_id    uuid not null references public.issues(id)    on delete cascade,
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  primary key (issue_id, proposal_id)
);

-- 5. links ----------------------------------------------------------------
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  url         text not null unique,
  title       text,
  source_type text check (source_type in
              ('reddit','forum','discord','official','video','article','other')),
  created_at  timestamptz not null default now()
);

-- 6. issue_links (M2M) ----------------------------------------------------
create table if not exists public.issue_links (
  issue_id uuid not null references public.issues(id) on delete cascade,
  link_id  uuid not null references public.links(id)  on delete cascade,
  primary key (issue_id, link_id)
);

-- 7. proposal_links (M2M) -------------------------------------------------
create table if not exists public.proposal_links (
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  link_id     uuid not null references public.links(id)     on delete cascade,
  primary key (proposal_id, link_id)
);

-- Indexes -----------------------------------------------------------------
create index if not exists idx_issues_space_id        on public.issues(space_id);
create index if not exists idx_issues_upvote_count    on public.issues(upvote_count desc);
create index if not exists idx_issue_proposals_pid    on public.issue_proposals(proposal_id);
create index if not exists idx_issue_links_link_id    on public.issue_links(link_id);
create index if not exists idx_proposal_links_link_id on public.proposal_links(link_id);

-- RLS: enable + public SELECT only ----------------------------------------
alter table public.spaces          enable row level security;
alter table public.issues          enable row level security;
alter table public.proposals       enable row level security;
alter table public.issue_proposals enable row level security;
alter table public.links           enable row level security;
alter table public.issue_links     enable row level security;
alter table public.proposal_links  enable row level security;

create policy "public read spaces"          on public.spaces          for select using (true);
create policy "public read issues"          on public.issues          for select using (true);
create policy "public read proposals"       on public.proposals       for select using (true);
create policy "public read issue_proposals" on public.issue_proposals for select using (true);
create policy "public read links"           on public.links           for select using (true);
create policy "public read issue_links"     on public.issue_links     for select using (true);
create policy "public read proposal_links"  on public.proposal_links  for select using (true);
