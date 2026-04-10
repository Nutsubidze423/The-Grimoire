-- Extension for UUID generation
create extension if not exists "pgcrypto";

-- ─── users ────────────────────────────────────────────────────────────────────
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text not null unique,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own row"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own row"
  on public.users for insert
  with check (auth.uid() = id);

-- ─── user_stats ───────────────────────────────────────────────────────────────
create table public.user_stats (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null unique references public.users(id) on delete cascade,
  level            integer not null default 1,
  xp               integer not null default 0,
  xp_to_next       integer not null default 100,
  streak_count     integer not null default 0,
  last_active_date date,
  stats            jsonb not null default '{
    "strength":0,"intelligence":0,"agility":0,"wisdom":0,
    "discipline":0,"vitality":0,"creativity":0,"charisma":0,
    "serenity":0,"endurance":0,"courage":0
  }'::jsonb,
  updated_at       timestamptz not null default now()
);

alter table public.user_stats enable row level security;

create policy "Users can read own stats"
  on public.user_stats for select
  using (auth.uid() = user_id);

create policy "Users can update own stats"
  on public.user_stats for update
  using (auth.uid() = user_id);

create policy "Users can insert own stats"
  on public.user_stats for insert
  with check (auth.uid() = user_id);

-- ─── auto-update updated_at ───────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_stats_updated_at
  before update on public.user_stats
  for each row execute function public.set_updated_at();
