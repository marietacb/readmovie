-- Nacionalidad original de la obra (libros, películas y series)
alter table books
  add column if not exists original_nationality text;

alter table movies
  add column if not exists original_nationality text;

alter table series
  add column if not exists original_nationality text;
