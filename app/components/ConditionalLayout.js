'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && (
        <header>
          Header{' '}
          <button
            onClick={async () => {
              // Remove authentication state from localStorage
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('supabaseSession');
              // Log out from Supabase
              const { supabase } = await import('@/lib/supabase');
              await supabase.auth.signOut();
              // Optionally reload or redirect to login page
              window.location.href = '/login';
            }}
          >
            Log out
          </button>
        </header>
      )}
      {!isLoginPage && <aside>Navbar</aside>}
      {children}
      {!isLoginPage && <footer>Footer</footer>}
    </>
  );
}
