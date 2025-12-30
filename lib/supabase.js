import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// Helper function to restore session from localStorage if needed
export async function restoreSession() {
  if (typeof window === 'undefined') return;
  
  const storedSession = localStorage.getItem('supabaseSession');
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession);
      if (session?.access_token && session?.refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        if (error) {
          console.error('Error restoring Supabase session:', error);
          // Clear invalid session
          localStorage.removeItem('supabaseSession');
        }
      }
    } catch (error) {
      console.error('Error parsing stored session:', error);
      localStorage.removeItem('supabaseSession');
    }
  }
}

/**
 * Ensures the user has a valid session by refreshing it if expired
 * @returns {Promise<Session>} The valid session
 * @throws {Error} If no valid session can be obtained
 */
export async function ensureValidSession() {
  // Get the current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    throw new Error(`Session error: ${sessionError.message}`);
  }
  
  if (!session) {
    throw new Error('No active session. Please log in and try again.');
  }
  
  // Try to refresh the session to ensure the token is valid
  // This will refresh if expired, or return the current session if still valid
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession(session);
  
  if (refreshError) {
    // If refresh fails, the session is invalid
    throw new Error('Session expired. Please log in and try again.');
  }
  
  // Return the refreshed session (or current if still valid)
  return refreshData.session || session;
}
