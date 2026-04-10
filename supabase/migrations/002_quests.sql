-- ─── quests ───────────────────────────────────────────────────────────────────
create table public.quests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  name          text not null,
  difficulty    text not null default 'Easy'
                  check (difficulty in ('Easy','Medium','Hard','Legendary')),
  category      text not null default 'Personal',
  quest_type    text not null default 'oneoff'
                  check (quest_type in ('daily','oneoff','boss','side')),
  due_date      date,
  completed_at  timestamptz,
  xp_reward     integer not null default 10,
  created_at    timestamptz not null default now()
);

alter table public.quests enable row level security;

create policy "Users can read own quests"
  on public.quests for select
  using (auth.uid() = user_id);

create policy "Users can insert own quests"
  on public.quests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quests"
  on public.quests for update
  using (auth.uid() = user_id);

create policy "Users can delete own quests"
  on public.quests for delete
  using (auth.uid() = user_id);

-- Index for fast per-user quest lookups
create index quests_user_id_idx on public.quests(user_id);
create index quests_due_date_idx on public.quests(user_id, due_date);
