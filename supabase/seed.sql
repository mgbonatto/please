-- seed.sql — M2 sample Path of Exile content. Safe to run once; ON CONFLICT guards re-runs.

-- Spaces ------------------------------------------------------------------
insert into public.spaces (id, slug, name, category, description, status) values
  ('11111111-1111-1111-1111-111111111111', 'path-of-exile-1', 'Path of Exile 1', 'games',
   'Community feedback for Path of Exile (the original).', 'approved'),
  ('22222222-2222-2222-2222-222222222222', 'path-of-exile-2', 'Path of Exile 2', 'games',
   'Community feedback for Path of Exile 2.', 'approved')
on conflict (id) do nothing;

-- Issues ------------------------------------------------------------------
insert into public.issues (id, space_id, title, description, upvote_count) values
  -- PoE2
  ('aaaaaaa1-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Endgame trading is slow and interrupts gameplay',
   'Trading high-value items requires whispering players, waiting for invites, and leaving your instance — it constantly breaks the flow of mapping.', 342),
  ('aaaaaaa1-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
   'No way to sell items while offline',
   'If you log off, your shop is gone. Players who cannot stay online for hours are effectively shut out of the trade economy.', 198),
  ('aaaaaaa1-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
   'Loot filter setup is intimidating for new players',
   'New players are overwhelmed by drops and do not know how to install or configure a loot filter, so the early game feels like noise.', 156),
  -- PoE1
  ('bbbbbbb1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Trade requires third-party websites',
   'Players must alt-tab to an external site to find listings and contact sellers, instead of trading inside the game.', 410),
  ('bbbbbbb1-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111',
   'The passive skill tree is overwhelming for newcomers',
   'With thousands of nodes and no in-game guidance, new players cannot tell a good path from a trap.', 220),
  ('bbbbbbb1-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111',
   'On-screen loot is too noisy at endgame',
   'High-density maps flood the screen with item labels, making it hard to spot the drops that matter.', 90)
on conflict (id) do nothing;

-- Proposals ---------------------------------------------------------------
insert into public.proposals (id, title, description, upvote_count) values
  ('ccccccc1-0000-0000-0000-000000000001',
   'Asynchronous in-game trade board with offline listings',
   'Let players list items on an in-game board that stays active while they are offline; buyers purchase instantly without a live whisper.', 280),
  ('ccccccc1-0000-0000-0000-000000000002',
   'Official in-game trade marketplace',
   'Build a first-party marketplace UI so trading never leaves the game or relies on third-party sites.', 350),
  ('ccccccc1-0000-0000-0000-000000000003',
   'Guided loot-filter setup with sensible defaults',
   'Ship a built-in starter filter and a simple in-game wizard so new players get a clean screen without external tools.', 120),
  ('ccccccc1-0000-0000-0000-000000000004',
   'Curated passive-tree starter paths',
   'Offer a few official, class-specific starter routes through the passive tree that newcomers can follow and later deviate from.', 175)
on conflict (id) do nothing;

-- Issue <-> Proposal links (the central M2M) ------------------------------
-- The async trade board addresses BOTH PoE2 trade issues -> "also addresses" demo.
insert into public.issue_proposals (issue_id, proposal_id) values
  ('aaaaaaa1-0000-0000-0000-000000000001', 'ccccccc1-0000-0000-0000-000000000001'),
  ('aaaaaaa1-0000-0000-0000-000000000002', 'ccccccc1-0000-0000-0000-000000000001'),
  ('bbbbbbb1-0000-0000-0000-000000000001', 'ccccccc1-0000-0000-0000-000000000002'),
  ('aaaaaaa1-0000-0000-0000-000000000003', 'ccccccc1-0000-0000-0000-000000000003'),
  ('bbbbbbb1-0000-0000-0000-000000000002', 'ccccccc1-0000-0000-0000-000000000004')
on conflict do nothing;

-- Links -------------------------------------------------------------------
insert into public.links (id, url, title, source_type) values
  ('ddddddd1-0000-0000-0000-000000000001',
   'https://www.reddit.com/r/pathofexile/comments/example-trade-thread/',
   'Reddit megathread: please fix endgame trading', 'reddit'),
  ('ddddddd1-0000-0000-0000-000000000002',
   'https://www.pathofexile.com/forum/view-thread/example-trade',
   'Official forum: trade improvements feedback', 'official'),
  ('ddddddd1-0000-0000-0000-000000000003',
   'https://www.youtube.com/watch?v=example-loot-filter',
   'Beginner loot filter setup (video)', 'video')
on conflict (id) do nothing;

-- Issue <-> Link ----------------------------------------------------------
insert into public.issue_links (issue_id, link_id) values
  ('aaaaaaa1-0000-0000-0000-000000000001', 'ddddddd1-0000-0000-0000-000000000001'),
  ('aaaaaaa1-0000-0000-0000-000000000003', 'ddddddd1-0000-0000-0000-000000000003')
on conflict do nothing;

-- Proposal <-> Link -------------------------------------------------------
-- The SAME reddit thread is attached to a Proposal too -> shared-link demo.
insert into public.proposal_links (proposal_id, link_id) values
  ('ccccccc1-0000-0000-0000-000000000001', 'ddddddd1-0000-0000-0000-000000000001'),
  ('ccccccc1-0000-0000-0000-000000000002', 'ddddddd1-0000-0000-0000-000000000002')
on conflict do nothing;
