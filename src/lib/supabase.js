import { createClient } from '@supabase/supabase-js';
import { teamData } from '../data/teamData.js';

// Fetch Supabase configuration strictly from environment variables (Supports VITE_, SUPABASE_, and NEXT_PUBLIC_)
// NEVER hardcode credentials in code files
const supabaseUrl =
  (typeof import.meta !== 'undefined' && (
    import.meta.env?.VITE_SUPABASE_URL ||
    import.meta.env?.SUPABASE_URL ||
    import.meta.env?.NEXT_PUBLIC_SUPABASE_URL ||
    import.meta.env?.PUBLIC_SUPABASE_URL
  )) ||
  (typeof process !== 'undefined' && process.env && (
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.PUBLIC_SUPABASE_URL
  )) || '';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && (
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    import.meta.env?.SUPABASE_ANON_KEY ||
    import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    import.meta.env?.PUBLIC_SUPABASE_ANON_KEY
  )) ||
  (typeof process !== 'undefined' && process.env && (
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.PUBLIC_SUPABASE_ANON_KEY
  )) || '';

// Initialize Supabase Client
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

/**
 * Check connection status and table availability
 */
export async function checkSupabaseHealth() {
  if (!supabase) return { connected: false, message: 'Supabase URL or Key missing in .env' };
  try {
    const { error } = await supabase.from('events').select('id').limit(1);
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true, message: 'Supabase connected and schema ready' };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

/**
 * Fetch all events in detailed sequential order directly from database
 */
export async function fetchEvents() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('order_seq', { ascending: true });

    if (!error && Array.isArray(data)) {
      return data.map((evt) => ({
        id: evt.slug || evt.id,
        slug: evt.slug,
        year: evt.year,
        category: evt.category,
        title: evt.title,
        tagline: evt.tagline,
        desc: evt.description,
        image: evt.image_url,
        venue: evt.venue,
        dates: evt.dates,
        status: evt.status,
        isActiveForRegistration: evt.is_active_for_registration,
        eligibility: evt.eligibility,
        hardwarePerk: evt.hardware_perk,
        whatsappCommunityUrl: evt.whatsapp_community_url,
        highlights: evt.highlights || [],
        instructions: evt.instructions || [],
        driveLinks: evt.drive_links || []
      }));
    }
    return [];
  } catch (err) {
    console.warn('Error fetching events from Supabase:', err);
    return [];
  }
}


/**
 * Fetch projects in detailed sequential order directly from database
 */
export async function fetchProjects() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_seq', { ascending: true });

    if (!error && Array.isArray(data)) {
      return data.map((p) => ({
        id: p.slug || p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        badge: p.badge,
        statusColor: p.status_color,
        description: p.description,
        details: p.details,
        tech: p.tech_stack || [],
        specs: p.specs || [],
        github: p.github_url,
        demo: p.demo_url,
        image: p.image_url
      }));
    }
    return [];
  } catch (err) {
    console.warn('Error fetching projects from Supabase:', err);
    return [];
  }
}

/**
 * Fetch team members in detailed sequential order directly from database
 */
export async function fetchTeamMembers() {
  const emptyGroup = { faculty: [], leads: [], core: [], volunteers: [] };
  if (!supabase) return emptyGroup;
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('order_seq', { ascending: true });

    if (!error && Array.isArray(data)) {
      const grouped = { faculty: [], leads: [], core: [], volunteers: [] };
      data.forEach((m) => {
        const cat = m.category || 'core';
        const target = grouped[cat] || grouped.core;
        target.push({
          id: m.member_id || m.id,
          name: m.name,
          role: m.role,
          domain: m.domain,
          department: m.department,
          year: m.year,
          quote: m.quote,
          bio: m.bio,
          image: m.image_url,
          fallbackImage: m.fallback_image_url,
          linkedin: m.linkedin_url,
          github: m.github_url,
          portfolio: m.portfolio_url,
          instagram: m.instagram_url
        });
      });
      if (teamData) {
        ['faculty', 'leads', 'core', 'volunteers'].forEach((cat) => {
          if (grouped[cat] && teamData[cat]) {
            const orderMap = new Map();
            teamData[cat].forEach((tm, idx) => {
              if (tm.id) orderMap.set(String(tm.id).toLowerCase().trim(), idx);
              if (tm.name) orderMap.set(String(tm.name).toLowerCase().trim(), idx);
            });
            grouped[cat] = grouped[cat]
              .map((item) => {
                const key_id = item.id ? String(item.id).toLowerCase().trim() : '';
                const key_name = item.name ? String(item.name).toLowerCase().trim() : '';
                const curated = teamData[cat].find((tm) => {
                  const tm_id = tm.id ? String(tm.id).toLowerCase().trim() : '';
                  const tm_name = tm.name ? String(tm.name).toLowerCase().trim() : '';
                  return (
                    (key_id && tm_id && (key_id === tm_id || key_id.includes(tm_id) || tm_id.includes(key_id))) ||
                    (key_name && tm_name && (key_name === tm_name || key_name.includes(tm_name) || tm_name.includes(key_name)))
                  );
                });
                if (curated) {
                  return {
                    ...item,
                    role: curated.role || item.role,
                    image:
                      item.image && typeof item.image === 'string' && item.image.trim() !== '' && item.image !== 'null'
                        ? item.image
                        : curated.image || item.image,
                  };
                }
                return item;
              })
              .sort((a, b) => {
                const keyA_id = a.id ? String(a.id).toLowerCase().trim() : '';
                const keyA_name = a.name ? String(a.name).toLowerCase().trim() : '';
                const keyB_id = b.id ? String(b.id).toLowerCase().trim() : '';
                const keyB_name = b.name ? String(b.name).toLowerCase().trim() : '';
                const orderA = orderMap.has(keyA_id) ? orderMap.get(keyA_id) : (orderMap.has(keyA_name) ? orderMap.get(keyA_name) : 999);
                const orderB = orderMap.has(keyB_id) ? orderMap.get(keyB_id) : (orderMap.has(keyB_name) ? orderMap.get(keyB_name) : 999);
                return orderA - orderB;
              });
          }
        });
      }
      return grouped;
    }
    return emptyGroup;
  } catch (err) {
    console.warn('Error fetching team members from Supabase:', err);
    return emptyGroup;
  }
}


/**
 * Realtime Automatic Subscriptions (Autosync with Supabase Database)
 */
export function subscribeToEvents(callback) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('realtime:events')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
      if (callback) callback();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToTeamMembers(callback) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('realtime:team_members')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => {
      if (callback) callback();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToProjects(callback) {
  if (!supabase) return () => {};
  const channel = supabase
    .channel('realtime:projects')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
      if (callback) callback();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}


