-- Notas breves por día (Year in Pixels, calendario…)
alter table public.profiles
  add column if not exists day_notes jsonb not null default '{}';
