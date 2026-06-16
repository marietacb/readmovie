-- Personalización del cuaderno PDF exportable (foto, pegatinas, frases)
alter table public.profiles
  add column if not exists notebook_export_settings jsonb not null default '{}';
