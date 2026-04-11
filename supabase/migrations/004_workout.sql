-- ─── workouts ─────────────────────────────────────────────────────────────────
create table public.workouts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  exercise_name text not null,
  muscle_group  text not null,
  intensity     text not null check (intensity in ('Light', 'Medium', 'Heavy')),
  xp_reward     int not null default 0,
  logged_at     timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

alter table public.workouts enable row level security;

create policy "Users can read own workouts"
  on public.workouts for select using (auth.uid() = user_id);
create policy "Users can insert own workouts"
  on public.workouts for insert with check (auth.uid() = user_id);
create policy "Users can delete own workouts"
  on public.workouts for delete using (auth.uid() = user_id);

create index workouts_user_date_idx on public.workouts(user_id, logged_at desc);
