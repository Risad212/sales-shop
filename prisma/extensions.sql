-- Required once per database, BEFORE `prisma db push`.
-- Run: psql "$DATABASE_URL" -f prisma/extensions.sql
-- (Neon and Supabase both support pgvector.)
CREATE EXTENSION IF NOT EXISTS vector;
