-- Live Translation Copilot
-- Adds per-user preferences for live translation and summary during sessions.

create table if not exists user_preferences (
  user_id text primary key,
  theme text,
  updated_at timestamptz default now()
);

alter table user_preferences
  add column if not exists copilot_target_lang text default 'fr',
  add column if not exists copilot_mode text default 'translate_only';

alter table user_preferences
  drop constraint if exists user_preferences_copilot_mode_check;

alter table user_preferences
  add constraint user_preferences_copilot_mode_check
  check (copilot_mode in ('translate_only', 'translate_summary', 'summary_only'));
