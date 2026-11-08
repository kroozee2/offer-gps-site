import postgres from "postgres";

// Your own Supabase database. Vercel's Supabase setup puts the connection string in
// POSTGRES_URL when you deploy. The site makes its one table the first time it runs.

let sql: ReturnType<typeof postgres> | null = null;
let ready: Promise<void> | null = null;

export function db() {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) sql = postgres(url, { ssl: "require", max: 1, prepare: false, idle_timeout: 20 });
  if (!ready) {
    ready = sql`
      create table if not exists site_events (
        id bigserial primary key,
        at timestamptz not null default now(),
        event text not null,
        page text,
        target text,
        referrer text,
        utm_source text,
        utm_campaign text
      )`.then(() => undefined);
  }
  return { sql, ready };
}
