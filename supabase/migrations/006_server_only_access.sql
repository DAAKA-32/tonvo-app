-- 006: server-only data access.
--
-- The browser no longer reads or writes these tables: every access goes
-- through authenticated API routes using the service role, which bypasses RLS.
-- With RLS enabled and no permissive policy, the public anon key (shipped in
-- the client bundle) can no longer read transcripts or edit subscriptions.

-- Permissive policies that were added by hand in production (anyone with the
-- anon key could read every conversation and grant themselves a paid plan).
drop policy if exists "Allow all selects" on public.conversations;
drop policy if exists "Allow all inserts" on public.conversations;
drop policy if exists "Allow all updates" on public.conversations;
drop policy if exists "Allow all selects" on public.analysis_segments;
drop policy if exists "Allow all inserts" on public.analysis_segments;
drop policy if exists "Allow all on user_consent" on public.user_consent;
drop policy if exists "Service role can manage subscriptions" on public.subscriptions;

-- Original client-side policies from 001/002: they relied on a Supabase JWT the
-- app never sends (auth is Firebase), so they only ever denied. Removed for clarity.
drop policy if exists "Users can view own conversations" on public.conversations;
drop policy if exists "Users can insert own conversations" on public.conversations;
drop policy if exists "Users can update own conversations" on public.conversations;
drop policy if exists "Users can view own segments" on public.analysis_segments;
drop policy if exists "Users can insert own segments" on public.analysis_segments;
drop policy if exists "Users can read own subscription" on public.subscriptions;

alter table public.conversations enable row level security;
alter table public.analysis_segments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_consent enable row level security;
alter table public.user_preferences enable row level security;

-- Report columns that production gained outside the migrations; recorded here
-- so a fresh database matches what the app writes.
alter table public.conversations
  add column if not exists classification text,
  add column if not exists score jsonb,
  add column if not exists diagnosis text,
  add column if not exists follow_up_actions text[],
  add column if not exists social_score integer,
  add column if not exists strengths text[],
  add column if not exists improvements text[];
