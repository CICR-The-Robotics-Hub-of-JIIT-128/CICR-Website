import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Validate certificate ID format: TEC2_CICR_<number>
  if (!id || !/^TEC2_CICR_\d+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid certificate ID format' });
  }

  // Use service-role key on server only — never exposed to frontend
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data, error } = await supabase
      .from('techtonic2.0_certificates')
      .select('certificate_id, name, role, drive_file_id, certificate_generated_at, created_at')
      .eq('certificate_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Return only public verification fields — never expose internal DB IDs or admin info
    return res.status(200).json({
      certificate_id: data.certificate_id,
      name: data.name,
      role: data.role,
      drive_file_id: data.drive_file_id || null,
      certificate_generated_at: data.certificate_generated_at || null,
      issued_at: data.certificate_generated_at || data.created_at,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

