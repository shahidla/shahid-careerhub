-- Expand certifications table with richer metadata columns
ALTER TABLE certifications
  ADD COLUMN IF NOT EXISTS issued_date     date,
  ADD COLUMN IF NOT EXISTS expires_date    date,
  ADD COLUMN IF NOT EXISTS category        text,
  ADD COLUMN IF NOT EXISTS subcategory     text,
  ADD COLUMN IF NOT EXISTS is_featured     boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS platform        text;
