-- ==========================================================
-- CREATE SUBSCRIBERS TABLE (IF NOT EXISTS)
-- ==========================================================
CREATE TABLE IF NOT EXISTS subscribers (
  id text PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'Blog Newsletter',
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- ==========================================================
-- OPTION 1 (RECOMMENDED): DISABLE RLS ON ALL TABLES
-- Copy and run these lines in Supabase SQL Editor:
-- ==========================================================

ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;


-- ==========================================================
-- OPTION 2: IF YOU PREFER RLS POLICIES ENABLED:
-- ==========================================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all posts" ON posts;
CREATE POLICY "Allow all posts" ON posts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all assets" ON assets;
CREATE POLICY "Allow all assets" ON assets FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all subscribers" ON subscribers;
CREATE POLICY "Allow all subscribers" ON subscribers FOR ALL USING (true) WITH CHECK (true);
