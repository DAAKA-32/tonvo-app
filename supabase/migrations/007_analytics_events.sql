-- 007: first-party funnel analytics (visit -> Start free click -> signup -> first live session -> paid).
--
-- Written only by the server (service role) through /api/track, the session and Stripe routes.
-- Privacy by design (CNIL audience-measurement exemption, first-party only):
--   * no IP address, no email, no free text: a random visitor id, the page path, the traffic source and a country code;
--   * the visitor id lives 13 months in the browser, rows are deleted after 25 months (keepalive cron);
--   * visitors can opt out (privacy page), Global Privacy Control and Do Not Track are honoured client-side.

create table if not exists public.analytics_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  event text not null check (event in (
    'page_view', 'cta_click', 'signup', 'upgrade_click', 'vsl_sound', 'vsl_fullscreen',
    'session_started', 'first_session', 'checkout_started', 'checkout_completed'
  )),
  anon_id text check (anon_id is null or char_length(anon_id) between 8 and 64),
  user_id text,
  path text check (path is null or char_length(path) <= 300),
  source text check (source is null or char_length(source) <= 120),
  ref text check (ref is null or char_length(ref) <= 120),
  utm_source text check (utm_source is null or char_length(utm_source) <= 120),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 120),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 120),
  utm_content text check (utm_content is null or char_length(utm_content) <= 120),
  utm_term text check (utm_term is null or char_length(utm_term) <= 120),
  referrer_host text check (referrer_host is null or char_length(referrer_host) <= 200),
  country text check (country is null or char_length(country) <= 2),
  device text check (device is null or device in ('mobile', 'tablet', 'desktop')),
  props jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at);
create index if not exists analytics_events_event_created_idx on public.analytics_events (event, created_at);
create index if not exists analytics_events_anon_idx on public.analytics_events (anon_id);
create index if not exists analytics_events_user_idx on public.analytics_events (user_id);

-- One signup and one first live session per account, whatever the client retries.
create unique index if not exists analytics_events_one_signup_idx
  on public.analytics_events (user_id) where event = 'signup';
create unique index if not exists analytics_events_one_first_session_idx
  on public.analytics_events (user_id) where event = 'first_session';

-- Server-only, like every other table since 006: RLS on, no policy, no grant to anon/authenticated.
alter table public.analytics_events enable row level security;
revoke all on public.analytics_events from anon, authenticated;
revoke all on sequence public.analytics_events_id_seq from anon, authenticated;
