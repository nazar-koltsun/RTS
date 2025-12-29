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
