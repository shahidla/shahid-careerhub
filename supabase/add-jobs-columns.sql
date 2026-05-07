-- Add missing columns to jobs table for RSS fetcher
-- Run once in Supabase SQL Editor

alter table jobs
  add column if not exists source_id text,
  add column if not exists posted_at timestamptz,
  add column if not exists salary text,
  add column if not exists job_type text;

-- Unique constraint to prevent duplicate jobs from same source
create unique index if not exists jobs_source_source_id_idx
  on jobs (source, source_id)
  where source_id is not null;
