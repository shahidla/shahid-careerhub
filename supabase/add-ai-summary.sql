-- Add ai_summary column to projects table
-- Run once in Supabase SQL Editor

alter table projects
  add column if not exists ai_summary text;
