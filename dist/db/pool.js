import { Pool } from 'pg';
import process from 'process';
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
//# sourceMappingURL=pool.js.map