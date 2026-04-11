-- ─── budgets ──────────────────────────────────────────────────────────────────
create table public.budgets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  category     text not null,
  month_year   text not null,  -- 'YYYY-MM'
  limit_amount numeric(10,2) not null default 0,
  created_at   timestamptz not null default now(),
  unique(user_id, category, month_year)
);

alter table public.budgets enable row level security;

create policy "Users can read own budgets"
  on public.budgets for select using (auth.uid() = user_id);
create policy "Users can insert own budgets"
  on public.budgets for insert with check (auth.uid() = user_id);
create policy "Users can update own budgets"
  on public.budgets for update using (auth.uid() = user_id);
create policy "Users can delete own budgets"
  on public.budgets for delete using (auth.uid() = user_id);

create index budgets_user_month_idx on public.budgets(user_id, month_year);

-- ─── expenses ─────────────────────────────────────────────────────────────────
create table public.expenses (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users(id) on delete cascade,
  category     text not null,
  amount       numeric(10,2) not null check (amount > 0),
  note         text,
  expense_date date not null default current_date,
  created_at   timestamptz not null default now()
);

alter table public.expenses enable row level security;

create policy "Users can read own expenses"
  on public.expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses"
  on public.expenses for insert with check (auth.uid() = user_id);
create policy "Users can delete own expenses"
  on public.expenses for delete using (auth.uid() = user_id);

create index expenses_user_month_idx on public.expenses(user_id, expense_date);

-- ─── savings_vault ────────────────────────────────────────────────────────────
create table public.savings_vault (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique references public.users(id) on delete cascade,
  goal_name     text not null default 'Savings Goal',
  goal_amount   numeric(10,2) not null default 0,
  saved_amount  numeric(10,2) not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.savings_vault enable row level security;

create policy "Users can read own vault"
  on public.savings_vault for select using (auth.uid() = user_id);
create policy "Users can insert own vault"
  on public.savings_vault for insert with check (auth.uid() = user_id);
create policy "Users can update own vault"
  on public.savings_vault for update using (auth.uid() = user_id);

create trigger savings_vault_updated_at
  before update on public.savings_vault
  for each row execute function public.set_updated_at();
