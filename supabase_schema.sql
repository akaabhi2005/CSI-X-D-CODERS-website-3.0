-- ============================================================================
-- CSI x D'CODERS PRODUCTION SECURE SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Execute this script in your Supabase SQL Editor to enforce strict security policies
-- ============================================================================

-- 1. SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public delete subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow auth manage subscribers" ON public.subscribers;

CREATE POLICY "Allow public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow auth manage subscribers" ON public.subscribers FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    registrationUrl TEXT,
    isFeatured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all events" ON public.events;
DROP POLICY IF EXISTS "Allow public select events" ON public.events;
DROP POLICY IF EXISTS "Allow auth manage events" ON public.events;

CREATE POLICY "Allow public select events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow auth manage events" ON public.events FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 3. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    image TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb,
    branch TEXT,
    level INT DEFAULT 5,
    domain TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all team" ON public.team;
DROP POLICY IF EXISTS "Allow public select team" ON public.team;
DROP POLICY IF EXISTS "Allow auth manage team" ON public.team;

CREATE POLICY "Allow public select team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Allow auth manage team" ON public.team FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 4. LEGACY HEADS TABLE
CREATE TABLE IF NOT EXISTS public.legacy_heads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    tenure TEXT NOT NULL,
    placedAt TEXT,
    bio TEXT NOT NULL,
    highlight TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.legacy_heads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all legacy_heads" ON public.legacy_heads;
DROP POLICY IF EXISTS "Allow public select legacy_heads" ON public.legacy_heads;
DROP POLICY IF EXISTS "Allow auth manage legacy_heads" ON public.legacy_heads;

CREATE POLICY "Allow public select legacy_heads" ON public.legacy_heads FOR SELECT USING (true);
CREATE POLICY "Allow auth manage legacy_heads" ON public.legacy_heads FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 5. SUB-TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.sub_teams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    frontDesc TEXT NOT NULL,
    backDesc TEXT NOT NULL,
    points JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.sub_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all sub_teams" ON public.sub_teams;
DROP POLICY IF EXISTS "Allow public select sub_teams" ON public.sub_teams;
DROP POLICY IF EXISTS "Allow auth manage sub_teams" ON public.sub_teams;

CREATE POLICY "Allow public select sub_teams" ON public.sub_teams FOR SELECT USING (true);
CREATE POLICY "Allow auth manage sub_teams" ON public.sub_teams FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 6. CORE VALUES TABLE
CREATE TABLE IF NOT EXISTS public.core_values (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    frontDesc TEXT NOT NULL,
    backDesc TEXT NOT NULL,
    points JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all core_values" ON public.core_values;
DROP POLICY IF EXISTS "Allow public select core_values" ON public.core_values;
DROP POLICY IF EXISTS "Allow auth manage core_values" ON public.core_values;

CREATE POLICY "Allow public select core_values" ON public.core_values FOR SELECT USING (true);
CREATE POLICY "Allow auth manage core_values" ON public.core_values FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 7. NEWS ISSUES TABLE
CREATE TABLE IF NOT EXISTS public.news_issues (
    id TEXT PRIMARY KEY,
    volume TEXT NOT NULL,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    coverImage TEXT NOT NULL,
    pdfUrl TEXT NOT NULL,
    fileSize TEXT NOT NULL,
    pageCount INT NOT NULL,
    topics JSONB DEFAULT '[]'::jsonb,
    isCurrent BOOLEAN DEFAULT false
);

ALTER TABLE public.news_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all news_issues" ON public.news_issues;
DROP POLICY IF EXISTS "Allow public select news_issues" ON public.news_issues;
DROP POLICY IF EXISTS "Allow auth manage news_issues" ON public.news_issues;

CREATE POLICY "Allow public select news_issues" ON public.news_issues FOR SELECT USING (true);
CREATE POLICY "Allow auth manage news_issues" ON public.news_issues FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 8. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    image TEXT NOT NULL,
    size TEXT NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public select gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow auth manage gallery" ON public.gallery;

CREATE POLICY "Allow public select gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow auth manage gallery" ON public.gallery FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 9. STATS TABLE
CREATE TABLE IF NOT EXISTS public.stats (
    id TEXT PRIMARY KEY DEFAULT 'main',
    eventsHosted TEXT NOT NULL,
    activeMembers TEXT NOT NULL,
    liveProjects TEXT NOT NULL,
    placementRate TEXT NOT NULL
);

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all stats" ON public.stats;
DROP POLICY IF EXISTS "Allow public select stats" ON public.stats;
DROP POLICY IF EXISTS "Allow auth manage stats" ON public.stats;

CREATE POLICY "Allow public select stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Allow auth manage stats" ON public.stats FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 10. SUPABASE STORAGE BUCKET POLICIES FOR 'media' BUCKET
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Read Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Media Storage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Manage Media Storage" ON storage.objects;

CREATE POLICY "Public Read Media Storage" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated Manage Media Storage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'media' AND auth.role() = 'authenticated') WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
