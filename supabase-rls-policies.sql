-- ==========================================================
-- OPTION 1 (EASIEST & RECOMMENDED): DISABLE RLS ON BOTH TABLES
-- Copy and run these 2 lines in Supabase SQL Editor:
-- ==========================================================

ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;


-- ==========================================================
-- OPTION 2: IF YOU PREFER RLS POLICIES ENABLED:
-- ==========================================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all posts" ON posts;
CREATE POLICY "Allow all posts" ON posts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all assets" ON assets;
CREATE POLICY "Allow all assets" ON assets FOR ALL USING (true) WITH CHECK (true);
