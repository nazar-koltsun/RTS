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
 * Logs out the user and clears all authentication data
 * @param {Function} redirectFn - Optional function to redirect to login page (e.g., router.push)
 */
export async function logoutUser(redirectFn) {
  if (typeof window === 'undefined') return;
  
  // Sign out from Supabase
  await supabase.auth.signOut();
  
  // Clear localStorage authentication data
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('supabaseSession');
  localStorage.removeItem('loginTimestamp');
  
  // Redirect to login page if redirect function provided
  if (redirectFn && typeof redirectFn === 'function') {
    redirectFn('/login');
  } else if (typeof window !== 'undefined') {
    // Fallback: use window.location if no redirect function provided
    window.location.href = '/login';
  }
}

/**
 * Stores the login timestamp in localStorage
 */
export function storeLoginTimestamp() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('loginTimestamp', Date.now().toString());
  }
}

/**
 * Gets the login timestamp from localStorage
 * @returns {number|null} Timestamp in milliseconds, or null if not found
 */
export function getLoginTimestamp() {
  if (typeof window === 'undefined') return null;
  const timestamp = localStorage.getItem('loginTimestamp');
  return timestamp ? parseInt(timestamp, 10) : null;
}

/**
 * Checks if the session is older than the specified hours
 * @param {number} hours - Number of hours to check against (default: 2)
 * @returns {boolean} True if session is older than specified hours
 */
export function isSessionTooOld(hours = 2) {
  const loginTimestamp = getLoginTimestamp();
  if (!loginTimestamp) return false;
  
  const maxAgeInMs = hours * 60 * 60 * 1000;
  const currentTime = Date.now();
  const sessionAge = currentTime - loginTimestamp;
  
  return sessionAge > maxAgeInMs;
}

/**
 * Checks if an error is related to invalid/expired refresh token
 * @param {Error|object} error - The error to check
 * @returns {boolean} True if error is a refresh token error
 */
export function isRefreshTokenError(error) {
  if (!error) return false;
  
  const errorMessage = (error.message || error.error?.message || String(error)).toLowerCase();
  const errorCode = error.status || error.code || '';
  
  // Check for specific refresh token error messages
  return (
    errorMessage.includes('invalid refresh token') ||
    errorMessage.includes('refresh_token') ||
    errorMessage.includes('refresh token') ||
    errorMessage.includes('token has expired') ||
    errorCode === 'invalid_grant' ||
    (errorCode === 401 && errorMessage.includes('token'))
  );
}

/**
 * Checks if session is too old and logs out if needed (for proactive logout on home page)
 * @param {Function} redirectFn - Optional function to redirect to login page
 * @returns {Promise<boolean>} True if user was logged out, false otherwise
 */
export async function checkSessionAgeAndLogout(redirectFn) {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check if session is too old (more than 2 hours)
  if (isSessionTooOld(2)) {
    console.log('Session is older than 2 hours, logging out...');
    await logoutUser(redirectFn);
    return true;
  }

  return false;
}

/**
 * Ensures the user has a valid session, handles token errors but doesn't check session age
 * @param {Function} redirectFn - Optional function to redirect to login page
 * @returns {Promise<Session|null>} The valid session, or null if logged out
 */
export async function ensureValidSession(redirectFn) {
  if (typeof window === 'undefined') {
    throw new Error('This function can only be called on the client side');
  }

  // Get the current session
  // Note: Supabase's autoRefreshToken will handle token refresh automatically
  // We just check if a session exists
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  // If there's a session error or invalid refresh token, logout
  if (sessionError) {
    const errorMessage = sessionError.message || '';
    if (
      errorMessage.includes('Invalid Refresh Token') ||
      errorMessage.includes('refresh_token') ||
      errorMessage.includes('JWT')
    ) {
      console.log('Invalid refresh token detected, logging out...');
      await logoutUser(redirectFn);
      return null;
    }
    throw new Error(`Session error: ${sessionError.message}`);
  }
  
  if (!session) {
    console.log('No active session, logging out...');
    await logoutUser(redirectFn);
    return null;
  }
  
  // Return the session - Supabase will auto-refresh if needed
  return session;
}
