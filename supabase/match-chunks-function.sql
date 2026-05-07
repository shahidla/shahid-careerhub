-- Vector similarity search function for RAG
-- Run this once in Supabase SQL Editor

create or replace function match_resume_chunks(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  source_table text,
  source_id text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    id,
    source_table,
    source_id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from resume_chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;
