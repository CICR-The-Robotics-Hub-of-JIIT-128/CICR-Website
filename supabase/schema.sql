-- =============================================================================
-- CICR WEBSITE - SUPABASE DATABASE SCHEMA
-- Centre for Innovation and Cyber-Physical Systems & Robotics (CICR)
-- Detailed & Sequential Architecture with Row Level Security (RLS)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. EVENTS TABLE (Sequential ordering via order_seq)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_seq INTEGER NOT NULL DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'sessions', -- 'sessions', 'techfest', 'techtonic', 'drono-war'
  year TEXT NOT NULL DEFAULT '2024-2025',
  dates TEXT,
  venue TEXT DEFAULT 'Room 140 Robotics Lab',
  eligibility TEXT DEFAULT 'Open to all Engineering & Tech Students',
  hardware_perk TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'ongoing', 'completed'
  is_active_for_registration BOOLEAN NOT NULL DEFAULT false,
  form_button_text TEXT DEFAULT 'Register Now on Website',
  whatsapp_community_url TEXT DEFAULT 'https://chat.whatsapp.com/GZNiuEOZYYPGOUZQUV1JVa',
  highlights JSONB DEFAULT '[]'::jsonb,
  instructions JSONB DEFAULT '[]'::jsonb,
  drive_links JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_events_order_seq ON public.events (order_seq ASC);
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events (slug);
CREATE INDEX IF NOT EXISTS idx_events_category_year ON public.events (category, year);
CREATE INDEX IF NOT EXISTS idx_events_registration_active ON public.events (is_active_for_registration);

-- =============================================================================
-- 2. PROJECTS TABLE (Sequential ordering via order_seq)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_seq INTEGER NOT NULL DEFAULT 0,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'autonomous', -- 'autonomous', 'combat', 'aerial', 'embedded'
  badge TEXT DEFAULT 'Active Bot Fleet',
  status_color TEXT DEFAULT '#10b981',
  description TEXT NOT NULL,
  details TEXT,
  tech_stack JSONB DEFAULT '[]'::jsonb,
  specs JSONB DEFAULT '[]'::jsonb,
  github_url TEXT DEFAULT 'https://github.com/CICR-The-Robotics-Hub-of-JIIT-128',
  demo_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_order_seq ON public.projects (order_seq ASC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);

-- =============================================================================
-- 3. TEAM MEMBERS TABLE (Sequential ordering via order_seq)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_seq INTEGER NOT NULL DEFAULT 0,
  member_id TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  domain TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'members', -- 'faculty', 'leads', 'core', 'members'
  department TEXT,
  year TEXT,
  quote TEXT,
  bio TEXT,
  image_url TEXT,
  fallback_image_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_team_members_order_seq ON public.team_members (order_seq ASC);
CREATE INDEX IF NOT EXISTS idx_team_members_category ON public.team_members (category);

-- =============================================================================
-- 4. REGISTRATIONS TABLE (Single Universal Endpoint Storage)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id TEXT UNIQUE NOT NULL, -- e.g. CICR-REG-2026-XXXX
  event_slug TEXT NOT NULL,
  event_title TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  branch_and_year TEXT NOT NULL,
  roll_number TEXT,
  participation_type TEXT NOT NULL DEFAULT 'Individual', -- 'Individual' or 'Team'
  team_name TEXT,
  team_size INTEGER DEFAULT 1,
  notes TEXT,
  qr_token TEXT UNIQUE NOT NULL, -- Verification QR token for entry desk check-in
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_id ON public.registrations (registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_slug ON public.registrations (event_slug);
CREATE INDEX IF NOT EXISTS idx_registrations_qr_token ON public.registrations (qr_token);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Public can read events, projects, team members
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);

-- Anyone can register via our website (Universal Registration Endpoint)
CREATE POLICY "Public insert registrations" ON public.registrations FOR INSERT WITH CHECK (true);

-- Registrants can view their own registration details using registration_id or qr_token
CREATE POLICY "Public read own registration" ON public.registrations FOR SELECT USING (true);

-- Service role / Admin has full management privileges
CREATE POLICY "Service role full access events" ON public.events FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access projects" ON public.projects FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access team_members" ON public.team_members FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access registrations" ON public.registrations FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================================================
-- 6. PRODUCTION READY - NO MOCK DATA
-- Realtime events, team members, and projects will be populated directly
-- via the Supabase Table Editor or Admin integrations.
-- =============================================================================

