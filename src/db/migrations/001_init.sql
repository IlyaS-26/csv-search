BEGIN;

-- Ускорение подстрочного поиска
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Задаем путь поиска
SET search_path = app, public;

COMMIT;