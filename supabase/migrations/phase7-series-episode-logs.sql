-- Registro de episodios vistos por día (permite repetir el mismo episodio en fechas distintas)
alter table series
  add column if not exists episode_watch_logs jsonb not null default '[]'::jsonb;
