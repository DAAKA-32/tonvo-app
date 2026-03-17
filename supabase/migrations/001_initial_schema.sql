-- Cue App - Initial Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Conversations table
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  title text not null,
  created_at timestamptz default now() not null,
  ended_at timestamptz,
  summary text,
  overall_tone text check (overall_tone in ('positive', 'neutral', 'negative', 'hesitant')),
  insights text[]
);

-- Analysis segments table
create table public.analysis_segments (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  timestamp bigint not null,
  transcript text not null,
  tone text not null check (tone in ('positive', 'neutral', 'negative', 'hesitant')),
  confidence real not null check (confidence >= 0 and confidence <= 1),
  suggestion text,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_conversations_user_id on public.conversations(user_id);
create index idx_segments_conversation_id on public.analysis_segments(conversation_id);

-- Row Level Security
alter table public.conversations enable row level security;
alter table public.analysis_segments enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own conversations"
  on public.conversations for select
  using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert own conversations"
  on public.conversations for insert
  with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can update own conversations"
  on public.conversations for update
  using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can view own segments"
  on public.analysis_segments for select
  using (
    conversation_id in (
      select id from public.conversations
      where user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

create policy "Users can insert own segments"
  on public.analysis_segments for insert
  with check (
    conversation_id in (
      select id from public.conversations
      where user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );
