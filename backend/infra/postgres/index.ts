import 'dotenv/config';
import { Pool, PoolConfig } from 'pg';

function getDatabaseUrl(): string {
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const host = process.env.POSTGRES_HOST || 'postgres';
  const port = process.env.POSTGRES_PORT || '5432';
  const database = process.env.POSTGRES_DB;
  const url = `postgresql://${user}:${password}@${host}:${port}/${database}`;

  if (!user || !password || !database) {
    throw new Error('Database credentials are not defined');
  }

  return url;
}

const connectionString = getDatabaseUrl();

const config: PoolConfig = {
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(config);
