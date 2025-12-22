'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Header from './Header';

// Helper function to check auth status from localStorage
function checkAuthStatus() {
  if (typeof window !== 'undefined') {
    const authStatus = localStorage.getItem('isAuthenticated');
    return authStatus === 'true';
  }
  return false;
}

export default function ConditionalLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  // Initialize auth state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    checkAuthStatus()
  );

  useEffect(() => {
    // Re-check auth status from localStorage when pathname changes
    // This ensures we catch localStorage updates after login
    const authenticated = checkAuthStatus();

    // Handle redirects based on current auth status from localStorage
    if (!authenticated && !isLoginPage) {
      // Redirect to login page if not authenticated
      router.replace('/login');
      return;
    } else if (authenticated && isLoginPage) {
      // Redirect to factoring page if authenticated and on login page
      router.replace('/factoring');
      return;
    }

    // Update state to match localStorage (defer to avoid synchronous setState warning)
    if (authenticated !== isAuthenticated) {
      // Use setTimeout to defer state update, avoiding synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setIsAuthenticated(authenticated);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [router, isLoginPage, pathname, isAuthenticated]);

  // Don't render protected content if not authenticated
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <>
      {!isLoginPage && <Header />}
      {!isLoginPage && <Navbar />}
      <main>{children}</main>
      {!isLoginPage && <footer>Footer</footer>}
    </>
  );
}
