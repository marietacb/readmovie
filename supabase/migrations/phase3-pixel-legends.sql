-- Leyendas de Year in Pixels por año (jsonb: { "2025": [...], "2026": [...] })
alter table public.profiles
  add column if not exists year_pixel_legends jsonb not null default '{}';
