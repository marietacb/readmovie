-- Diario de visionados y estado en películas
alter table movies
  add column if not exists watch_logs jsonb not null default '[]'::jsonb;

alter table movies
  add column if not exists status text not null default 'watched';
