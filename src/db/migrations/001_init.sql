CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS datasets (
    id BIGINT GENERATED ALWAYS AS IDENTIFY PRIMARY KEY,
    name TEXT NOT NULL,
    columns TEXT[] NOT NULL,
    row_count BIGINT DEFAULT 0,
    status TEXT NOT NULL DEFAULT "importing",
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE datasets IS "Метаданные загруженных CSV-датасетов";
COMMENT ON COLUMN datasets.columns IS "Имена колонок из заголовка CSV";