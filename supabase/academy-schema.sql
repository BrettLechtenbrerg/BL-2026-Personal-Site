--==============================================================================
-- MASTER'S EDGE ACADEMY — Supabase schema (me_ prefix)
--==============================================================================
-- ONE-TIME APPLY: paste this whole file into the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → Run). Safe to re-run: everything is
-- IF NOT EXISTS.
--
-- SECURITY MODEL: RLS is ENABLED on every table with ZERO policies, and
-- anon/authenticated grants are revoked — ONLY the service-role key (used by
-- the Next.js /api/academy/* routes) can touch these tables. There is no
-- browser-side Supabase access anywhere on this site.
--==============================================================================

-- Members ---------------------------------------------------------------------
create table if not exists me_users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  avatar        text not null default '🥋',
  xp            integer not null default 0,
  role          text not null default 'member' check (role in ('member', 'admin')),
  created_at    timestamptz not null default now()
);

-- Per-module progress ---------------------------------------------------------
create table if not exists me_progress (
  user_id     uuid not null references me_users(id) on delete cascade,
  module_slug text not null,
  lesson_done boolean not null default false,
  quiz_score  integer,
  passed      boolean not null default false,
  passed_at   timestamptz,
  primary key (user_id, module_slug)
);

-- Every quiz attempt (audit trail) --------------------------------------------
create table if not exists me_quiz_attempts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references me_users(id) on delete cascade,
  module_slug text not null,
  score       integer not null,
  answers     jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

-- Badges ----------------------------------------------------------------------
create table if not exists me_awards (
  user_id    uuid not null references me_users(id) on delete cascade,
  badge_slug text not null,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_slug)
);

-- XP ledger (me_users.xp is the cached sum) -----------------------------------
create table if not exists me_xp_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references me_users(id) on delete cascade,
  kind       text not null,
  points     integer not null,
  ref        text,
  created_at timestamptz not null default now()
);

-- Community -------------------------------------------------------------------
create table if not exists me_posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references me_users(id) on delete cascade,
  body        text not null,
  module_slug text,
  channel     text not null default 'general',
  title       text,
  pinned      boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists me_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references me_posts(id) on delete cascade,
  user_id    uuid not null references me_users(id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

create table if not exists me_reactions (
  post_id    uuid not null references me_posts(id) on delete cascade,
  user_id    uuid not null references me_users(id) on delete cascade,
  emoji      text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, emoji)
);

-- Events (office hours, calls) — admin-created, member-visible ---------------
create table if not exists me_events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  starts_at     timestamptz not null,
  ends_at       timestamptz not null,
  link          text,
  recording_url text,
  created_at    timestamptz not null default now()
);

-- Certification submissions ---------------------------------------------------
create table if not exists me_submissions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references me_users(id) on delete cascade,
  kind       text not null check (kind in ('project', 'exam')),
  body       text,
  link       text,
  status     text not null default 'pending' check (status in ('pending', 'approved', 'revise')),
  feedback   text,
  created_at timestamptz not null default now()
);

-- Upgrades (Sep 6 2026: channels) — no-ops on a fresh install. Must run
-- BEFORE the indexes below, which reference the new columns. -----------------
alter table me_users add column if not exists role text not null default 'member';
alter table me_posts add column if not exists channel text not null default 'general';
alter table me_posts add column if not exists title   text;
alter table me_posts add column if not exists pinned  boolean not null default false;
-- Make Brett an admin (can post Announcements + pin posts):
--   update me_users set role = 'admin' where email = 'brett@brettlechtenberg.com';

-- Indexes ---------------------------------------------------------------------
create index if not exists me_quiz_attempts_user_idx on me_quiz_attempts (user_id, module_slug);
create index if not exists me_xp_events_user_idx     on me_xp_events (user_id);
create index if not exists me_posts_created_idx      on me_posts (created_at desc);
create index if not exists me_comments_post_idx      on me_comments (post_id);
create index if not exists me_submissions_user_idx   on me_submissions (user_id, kind);
create index if not exists me_users_xp_idx           on me_users (xp desc);
create index if not exists me_events_starts_idx      on me_events (starts_at);
create index if not exists me_posts_channel_idx      on me_posts (channel, pinned desc, created_at desc);

-- Lock down: RLS on, zero policies, browser roles revoked ---------------------
do $$
declare t text;
begin
  foreach t in array array[
    'me_users','me_progress','me_quiz_attempts','me_awards','me_xp_events',
    'me_posts','me_comments','me_reactions','me_submissions','me_events'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('revoke all on %I from anon, authenticated', t);
    -- Explicit grant: depending on which role runs this script, service_role
    -- may not inherit access via default privileges.
    execute format('grant all on %I to service_role', t);
  end loop;
end $$;
