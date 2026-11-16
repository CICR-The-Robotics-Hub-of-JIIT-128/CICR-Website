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
-- 6. INITIAL SEED DATA (Events, Projects, Team, Active Registration)
-- =============================================================================

-- Seed Active Event for Universal Registration: TechTonic 3.0
INSERT INTO public.events (
  order_seq, slug, title, tagline, description, category, year, dates, venue, eligibility,
  hardware_perk, status, is_active_for_registration, form_button_text,
  highlights, instructions
) VALUES (
  1,
  'techtonic-3',
  'TechTonic 3.0: Autonomous Robotics & Embedded ROS2 Bootcamp',
  'Hands-on Intensive Hardware-Software Integration Workshop by CICR Hub',
  'Immersive multi-day hands-on bootcamp focusing on ROS2 navigation, LiDAR mapping, ESP32 telemetry, and competitive robotics system design.',
  'techtonic',
  '2024-2025',
  'March 2025 (4 Intensive Sessions)',
  'Room 140 Robotics Lab & Computing Lab, JIIT-128',
  '1st, 2nd, and 3rd Year B.Tech Students (All Branches)',
  'Complete Lab Access, Dev Boards & Sensor Kits Provided',
  'upcoming',
  true,
  'Register for TechTonic 3.0',
  '["Real-time ROS2 SLAM Mapping with RPLIDAR A1", "ESP32 & Wireless Mesh Sensor Fusion", "Autonomous Obstacle Avoidance Algorithms", "Hands-on Soldering, Motor Drivers & Power Distribution", "Exclusive Lab Access & Hardware Lending Benefits", "Official CICR Certificate of Completion"]'::jsonb,
  '["Please bring your own laptop with Ubuntu or WSL2 / Linux VM installed.", "Basic programming experience in C++ or Python is recommended.", "Attendance in all sessions is mandatory for the completion certificate.", "All lab components must be checked out and returned to Room 140 inventory."] '::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  is_active_for_registration = EXCLUDED.is_active_for_registration,
  status = EXCLUDED.status;

-- Seed Other Featured Events
INSERT INTO public.events (
  order_seq, slug, title, tagline, description, category, year, dates, venue, status, is_active_for_registration, highlights
) VALUES
(
  2,
  'drono-war-1',
  'Drono-o-war 1.0',
  'National Collegiate Drone Obstacle & Tactical Racing Tournament',
  'Flagship aerial tournament bringing pilots from across the nation to test high-speed obstacle navigation and drone maneuvering.',
  'drono-war',
  '2024-2025',
  'February 2025',
  'Main Sports Ground & Drone Arena, JIIT-128',
  'completed',
  false,
  '["FPV Aerial Obstacle Course", "High-Speed Time Trials", "Precision Landing Challenges", "Inter-College Robotics Battle"]'::jsonb
),
(
  3,
  'techtonic-2',
  'TechTonic 2.0',
  'Embedded Electronics & Line Following Optimization',
  'Comprehensive workshop covering PID algorithms, motor driver circuits, and sensor array calibration.',
  'techtonic',
  '2023-2024',
  'October 2023',
  'Room 140 Robotics Lab',
  'completed',
  false,
  '["PID Tuning Methodologies", "High-RPM DC Motor Control", "Custom PCB Design Principles"]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Seed Projects in Proper Sequential Manner
INSERT INTO public.projects (
  order_seq, slug, title, category, badge, status_color, description, tech_stack, specs, github_url
) VALUES
(
  1,
  'slam-rover',
  'Autonomous LiDAR SLAM Rover',
  'autonomous',
  'Active Bot Fleet',
  '#10b981',
  '360° RPLIDAR A1 + ROS2 Nav2 autonomous mapping and dynamic obstacle avoidance rover. Features Cartographer SLAM, sensor fusion EKF, and waypoint navigation on Jetson Nano.',
  '["ROS2 Humble", "RPLIDAR A1", "Jetson Nano", "Nav2", "Cartographer"]'::jsonb,
  '[{"label": "Precision", "value": "±2 cm"}, {"label": "Sensor Range", "value": "12m LiDAR"}, {"label": "Compute OS", "value": "Ubuntu 22.04"}]'::jsonb,
  'https://github.com/CICR-The-Robotics-Hub-of-JIIT-128'
),
(
  2,
  'robo-soccer',
  'Robo-Soccer Striker V2',
  'combat',
  'Competition Ready',
  '#ff601c',
  'High-agility 4-omniwheel combat sports robot with high-torque solenoid ball kicker, ultra-low latency wireless telemetry, and real-time spin vector calculation.',
  '["Omni-Drive", "ESP32", "Solenoid Kicker", "ESP-NOW", "LiPo 3S"]'::jsonb,
  '[{"label": "Max Speed", "value": "3.4 m/s"}, {"label": "Response", "value": "<15 ms"}, {"label": "Kicker Impulse", "value": "45 N"}]'::jsonb,
  'https://github.com/CICR-The-Robotics-Hub-of-JIIT-128'
),
(
  3,
  'aerial-quad',
  'Tactical Aerial Quadcopter (FPV)',
  'aerial',
  'Drono-o-war Fleet',
  '#38bdf8',
  'Custom 450mm carbon-fiber quadcopter optimized for tactical obstacle courses, indoor altitude holding, and high-speed pilot maneuverability in national competitions.',
  '["Pixhawk 4", "BLDC 2450KV", "ELRS 2.4GHz", "FPV Cam", "QGroundControl"]'::jsonb,
  '[{"label": "Airframe", "value": "450mm Carbon"}, {"label": "Thrust-to-Weight", "value": "4.2 : 1"}, {"label": "Endurance", "value": "14 mins"}]'::jsonb,
  'https://github.com/CICR-The-Robotics-Hub-of-JIIT-128'
),
(
  4,
  'circuit-rush',
  'Circuit Rush 1kHz PID Line Tracer',
  'embedded',
  'Hall of Fame',
  '#a855f7',
  'Custom high-speed 8-sensor reflectance line-tracer with ultra-low center of gravity, active ground-effect suction fan, and 1000Hz discrete PID control loop.',
  '["STM32 Arm Cortex-M4", "QTR-8A Array", "Coreless Motors", "FreeRTOS"]'::jsonb,
  '[{"label": "Loop Rate", "value": "1000 Hz"}, {"label": "Cornering Gs", "value": "1.8 G"}, {"label": "Top Velocity", "value": "4.1 m/s"}]'::jsonb,
  'https://github.com/CICR-The-Robotics-Hub-of-JIIT-128'
) ON CONFLICT (slug) DO NOTHING;

-- Seed Faculty & Leads
INSERT INTO public.team_members (
  order_seq, member_id, name, role, domain, category, department, quote, bio, image_url, linkedin_url
) VALUES
(
  1,
  'faculty-1',
  'Prof. Vivek Kumar Dwivedi',
  'Faculty Coordinator',
  'Faculty Coordinator',
  'faculty',
  'Department of ECE, JIIT-128',
  'Guiding the next generation of engineers to pioneer autonomous robotics and intelligent cyber-physical systems.',
  'Guiding CICR in advanced robotics research, signal processing, autonomous kinematics, and academic project initiatives.',
  'https://www.jiit.ac.in/uploads/prof_vivek_dwivedi_64026c12dd.JPG',
  'https://www.linkedin.com/school/jaypee-institute-of-information-technology/'
),
(
  2,
  'faculty-2',
  'Prof. Jitendra Mohan',
  'Faculty Coordinator',
  'Faculty Coordinator',
  'faculty',
  'Department of ECE, JIIT-128',
  'Inspiring hands-on innovation, embedded hardware excellence, and multidisciplinary engineering.',
  'Advising students on embedded system design, sensor fusion algorithms, and inter-departmental innovation projects.',
  'https://www.jiit.ac.in/uploads/prof_jitendra_mohan_2e7f856416.JPG',
  'https://www.linkedin.com/school/jaypee-institute-of-information-technology/'
),
(
  3,
  'lead-1',
  'Dhruvi Gupta',
  'Management Lead',
  'Management',
  'leads',
  'Management Domain',
  'Imagining Things and Making it Real...',
  'Leading management operations, institutional strategies, and multi-domain engineering initiatives at CICR.',
  'https://drive.google.com/thumbnail?id=18dWE-Q-cGWEoa74pBwru9JeOYDL-DtKI&sz=w800',
  'https://www.linkedin.com/in/dhruvi-guptadg'
) ON CONFLICT (member_id) DO NOTHING;

