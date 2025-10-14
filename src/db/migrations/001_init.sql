CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS datasets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    columns TEXT[] NOT NULL,
    row_count BIGINT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'importing',
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE datasets IS 'Метаданные загруженных CSV-датасетов';
COMMENT ON COLUMN datasets.columns IS 'Имена колонок из заголовка CSV';

CREATE TABLE IF NOT EXISTS records (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dataset_id BIGINT NOT NULL REFERENCES dataset(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    search_text TEXT GENERATED ALWAYS AS (
        array_to_string(ARRAY(SELECT value::text FROM jsonb_each_text(data)), ' ')
    ) STORED
);

CREATE INDEX IF NOT EXISTS records_ds_idx
    ON records(dataset_id);

CREATE INDEX IF NOT EXISTS records_search_trgm_idx
    ON records USING GIN (search_text gin_trgm_ops);