-- Fase 1: Wishlist + serie/saga en libros
-- Ejecuta en Supabase si ya tenías el schema anterior

alter table public.books
  add column if not exists series_label text;

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

create index if not exists wishlist_user_id_idx on public.wishlist (user_id);

alter table public.wishlist enable row level security;

drop policy if exists "wishlist_select_own" on public.wishlist;
drop policy if exists "wishlist_insert_own" on public.wishlist;
drop policy if exists "wishlist_update_own" on public.wishlist;
drop policy if exists "wishlist_delete_own" on public.wishlist;

create policy "wishlist_select_own" on public.wishlist for select using (auth.uid() = user_id);
create policy "wishlist_insert_own" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "wishlist_update_own" on public.wishlist for update using (auth.uid() = user_id);
create policy "wishlist_delete_own" on public.wishlist for delete using (auth.uid() = user_id);
