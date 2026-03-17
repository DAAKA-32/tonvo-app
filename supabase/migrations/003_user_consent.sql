-- User consent tracking for GDPR compliance
-- Run this in your Supabase SQL Editor

create table public.user_consent (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null unique,
  terms_accepted boolean default false not null,
  terms_accepted_at timestamptz,
  privacy_accepted boolean default false not null,
  created_at timestamptz default now() not null
);

create index idx_user_consent_user_id on public.user_consent(user_id);

-- RLS
alter table public.user_consent enable row level security;

-- Allow service role full access (used by API routes via supabaseAdmin)
-- No direct client access needed since consent is stored via API
