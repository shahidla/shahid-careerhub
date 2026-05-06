create extension if not exists vector;

drop table if exists resume_chunks;
drop table if exists jobs;
drop table if exists achievements;
drop table if exists blogs;
drop table if exists skills;
drop table if exists certifications;
drop table if exists projects;
drop table if exists experience;
drop table if exists profile;

create table profile (
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

create table experience (
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

create table projects (
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

create table certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  code text,
  issuer text,
  year text,
  credential_url text,
  is_ai boolean default false,
  sort_order integer,
  updated_at timestamptz default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  items text[],
  is_ai boolean default false,
  sort_order integer,
  updated_at timestamptz default now()
);

create table blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  tags text[],
  is_ai boolean default false,
  sort_order integer,
  updated_at timestamptz default now()
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  year text,
  sort_order integer,
  updated_at timestamptz default now()
);

create table jobs (
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

create table resume_chunks (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  source_table text,
  source_id uuid,
  embedding vector(1536),
  updated_at timestamptz default now()
);

create index if not exists resume_chunks_embedding_idx
  on resume_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
