-- Fecha de visionado para películas (calendario de actividad)
alter table public.movies
  add column if not exists watch_date date;
