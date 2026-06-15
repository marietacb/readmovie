-- Ejecuta este SQL en el editor de Supabase (SQL → New query)
-- Seguro para volver a ejecutar: usa IF NOT EXISTS y DROP POLICY IF EXISTS

-- Perfil de usuario (meta de lectura y favoritos del mes)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  reading_goal integer not null default 24,
  monthly_favorites jsonb not null default '{}',
  book_of_year_brackets jsonb not null default '{}',
  year_pixel_legends jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Libros
create table if not exists public.books (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  author text not null,
  pages integer,
  total_chapters integer,
  format text[] not null default '{}',
  start_date date,
  end_date date,
  publisher text,
  genre text,
  publish_year integer,
  story_type text[] not null default '{}',
  characters text,
  opinion text,
  rating numeric(3,1) not null default 0,
  romance_rating numeric(3,1) not null default 0,
  hype_rating numeric(3,1) not null default 0,
  cover_url text,
  spine_color text not null,
  series_label text,
  chapters jsonb not null default '[]',
  reading_sessions jsonb not null default '[]',
  quotes jsonb not null default '[]',
  created_at timestamptz not null,
  updated_at timestamptz not null
);

-- Películas
create table if not exists public.movies (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  director text not null default '',
  genre text not null default '',
  summary text not null default '',
  rating smallint not null default 0,
  feelings text[] not null default '{}',
  best_moments text[] not null default '{}',
  worst_moments text[] not null default '{}',
  favourite_quotes text[] not null default '{}',
  poster_url text,
  watch_date date,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

-- Series
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

-- Wishlist (lista de deseos del cuaderno)
create table if not exists public.wishlist (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  series_label text,
  read boolean not null default false,
  book_id text,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

-- Índices
create index if not exists books_user_id_idx on public.books (user_id);
create index if not exists movies_user_id_idx on public.movies (user_id);
create index if not exists series_user_id_idx on public.series (user_id);
create index if not exists wishlist_user_id_idx on public.wishlist (user_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.movies enable row level security;
alter table public.series enable row level security;
alter table public.wishlist enable row level security;

-- Políticas (se recrean si ya existían)
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "books_select_own" on public.books;
drop policy if exists "books_insert_own" on public.books;
drop policy if exists "books_update_own" on public.books;
drop policy if exists "books_delete_own" on public.books;

create policy "books_select_own" on public.books for select using (auth.uid() = user_id);
create policy "books_insert_own" on public.books for insert with check (auth.uid() = user_id);
create policy "books_update_own" on public.books for update using (auth.uid() = user_id);
create policy "books_delete_own" on public.books for delete using (auth.uid() = user_id);

drop policy if exists "movies_select_own" on public.movies;
drop policy if exists "movies_insert_own" on public.movies;
drop policy if exists "movies_update_own" on public.movies;
drop policy if exists "movies_delete_own" on public.movies;

create policy "movies_select_own" on public.movies for select using (auth.uid() = user_id);
create policy "movies_insert_own" on public.movies for insert with check (auth.uid() = user_id);
create policy "movies_update_own" on public.movies for update using (auth.uid() = user_id);
create policy "movies_delete_own" on public.movies for delete using (auth.uid() = user_id);

drop policy if exists "series_select_own" on public.series;
drop policy if exists "series_insert_own" on public.series;
drop policy if exists "series_update_own" on public.series;
drop policy if exists "series_delete_own" on public.series;

create policy "series_select_own" on public.series for select using (auth.uid() = user_id);
create policy "series_insert_own" on public.series for insert with check (auth.uid() = user_id);
create policy "series_update_own" on public.series for update using (auth.uid() = user_id);
create policy "series_delete_own" on public.series for delete using (auth.uid() = user_id);

drop policy if exists "wishlist_select_own" on public.wishlist;
drop policy if exists "wishlist_insert_own" on public.wishlist;
drop policy if exists "wishlist_update_own" on public.wishlist;
drop policy if exists "wishlist_delete_own" on public.wishlist;

create policy "wishlist_select_own" on public.wishlist for select using (auth.uid() = user_id);
create policy "wishlist_insert_own" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "wishlist_update_own" on public.wishlist for update using (auth.uid() = user_id);
create policy "wishlist_delete_own" on public.wishlist for delete using (auth.uid() = user_id);

-- Crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
