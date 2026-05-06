-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- Profile (single row — your personal info)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  headline text,
  years_experience integer,
  positioning text[],
  education text[],
  contact jsonb,
  proof_points text[],
  updated_at timestamptz default now()
);

-- Experience (one row per role)
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  client text,
  role text,
  location text,
  start_date text,
  end_date text,
  description text,
  technologies text[],
  sort_order integer,
  updated_at timestamptz default now()
);

-- Projects (one row per project)
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  client text,
  impact text,
  description text,
  technologies text[],
  tags text[],
  url text,
  is_ai boolean default false,
  sort_order integer,
  updated_at timestamptz default now()
);

-- Certifications
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  credly_url text,
  pdf_url text,
  is_ai boolean default false,
  sort_order integer,
  updated_at timestamptz default now()
);

-- Skills
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  items text[],
  is_ai boolean default false,
  sort_order integer,
  updated_at timestamptz default now()
);

-- Blogs
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  summary text,
  tags text[],
  is_ai boolean default false,
  published_at text,
  updated_at timestamptz default now()
);

-- Achievements
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  year text,
  sort_order integer,
  updated_at timestamptz default now()
);

-- Jobs (aggregated + manual)
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text,
  location text,
  description text,
  url text,
  source text,
  tags text[],
  match_score numeric,
  match_reasoning text,
  status text default 'new',
  fetched_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Resume chunks for RAG (embeddings)
create table if not exists resume_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source_table text,
  source_id uuid,
  embedding vector(1536),
  updated_at timestamptz default now()
);

-- Index for fast vector similarity search
create index if not exists resume_chunks_embedding_idx
  on resume_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
