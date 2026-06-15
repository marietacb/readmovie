-- Solo para añadir series si ya ejecutaste el schema antes.
-- Ejecuta esto si el error fue "policy already exists" y la tabla series no existe aún.

create table if not exists public.series (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  creator text not null default '',
  genre text not null default '',
  platform text not null default '',
  summary text not null default '',
  rating smallint not null default 0,
  status text not null default 'plan_to_watch',
  seasons integer,
  total_episodes integer,
  episodes_watched integer,
  start_date date,
  end_date date,
  feelings text[] not null default '{}',
  favorite_characters text,
  favorite_episodes text[] not null default '{}',
  best_moments text[] not null default '{}',
  worst_moments text[] not null default '{}',
  favourite_quotes text[] not null default '{}',
  poster_url text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index if not exists series_user_id_idx on public.series (user_id);

alter table public.series enable row level security;

drop policy if exists "series_select_own" on public.series;
drop policy if exists "series_insert_own" on public.series;
drop policy if exists "series_update_own" on public.series;
drop policy if exists "series_delete_own" on public.series;

create policy "series_select_own" on public.series for select using (auth.uid() = user_id);
create policy "series_insert_own" on public.series for insert with check (auth.uid() = user_id);
create policy "series_update_own" on public.series for update using (auth.uid() = user_id);
create policy "series_delete_own" on public.series for delete using (auth.uid() = user_id);
