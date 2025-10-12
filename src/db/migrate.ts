import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Проведение инициализации SQL-таблицы перед началом работы сервиса 
 */
export async function runMigrations() {
    const sql = await fs.readFile(path.join(dirname, 'migrations', '001_init.sql'), 'utf-8');
    await pool.query(sql);
}
