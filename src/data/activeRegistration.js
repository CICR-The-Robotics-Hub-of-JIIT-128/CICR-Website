/**
 * Centralized Permanent Registration Configuration
 * 
 * Powered 100% by Supabase real-time database.
 * The permanent route stays consistent across all posters and universal QR codes.
 */

export const activeRegistrationConfig = {
  isRegistrationActive: false,
  permanentRoute: '/register',
  permanentUrlDisplay: 'https://cicr.in/register',
  currentEvent: null,
  upcomingQueue: []
};
