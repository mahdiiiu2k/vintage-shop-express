import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
  throw new Error(
    "DATABASE_URL or SUPABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use DATABASE_URL if available, otherwise construct from SUPABASE_URL
let connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.SUPABASE_URL) {
  // Extract database URL from Supabase URL
  const supabaseUrl = process.env.SUPABASE_URL;
  const projectRef = supabaseUrl.split('//')[1].split('.')[0];
  connectionString = `postgresql://postgres:[YOUR_DB_PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;
}

export const pool = new Pool({ 
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});
export const db = drizzle(pool, { schema });
