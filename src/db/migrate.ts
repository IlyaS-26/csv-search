import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import "dotenv/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Проведение инициализации SQL-таблицы перед началом работы сервиса 
 */
export async function runMigrations() {
    const sql = await fs.readFile(path.join(dirname, 'migrations', '001_init.sql'), 'utf-8');
    await pool.query(sql);
}