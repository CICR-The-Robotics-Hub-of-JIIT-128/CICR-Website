import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createClient } from '@supabase/supabase-js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'local-api-certificates',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const match = req.url?.match(/^\/api\/certificates\/(TEC2_CICR_\d+)/i);
            if (match) {
              const id = match[1];
              const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
              const supabaseKey =
                env.SUPABASE_SERVICE_ROLE_KEY ||
                env.SUPABASE_ANON_KEY ||
                env.VITE_SUPABASE_ANON_KEY;

              if (!supabaseUrl || !supabaseKey) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Database credentials missing in .env' }));
                return;
              }

              try {
                const supabase = createClient(supabaseUrl, supabaseKey, {
                  auth: { persistSession: false, autoRefreshToken: false }
                });

                const { data, error } = await supabase
                  .from('techtonic2.0_certificates')
                  .select('certificate_id, name, role, drive_file_id, certificate_generated_at, created_at')
                  .eq('certificate_id', id)
                  .single();

                if (error || !data) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Certificate not found' }));
                  return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    certificate_id: data.certificate_id,
                    name: data.name,
                    role: data.role,
                    drive_file_id: data.drive_file_id || null,
                    certificate_generated_at: data.certificate_generated_at || null,
                    issued_at: data.certificate_generated_at || data.created_at
                  })
                );
                return;
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Internal error' }));
                return;
              }
            }
            next();
          });
        }
      }
    ],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'REACT_APP_', 'PUBLIC_', 'SUPABASE_'],
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
