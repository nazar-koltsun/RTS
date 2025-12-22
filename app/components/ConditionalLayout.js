'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Header from './Header';

export default function ConditionalLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    const authenticated = authStatus === 'true';

    setIsAuthenticated(authenticated);
    setIsCheckingAuth(false);

    if (!authenticated && !isLoginPage) {
      // Redirect to login page if not authenticated
      router.replace('/login');
    } else if (authenticated && isLoginPage) {
      // Redirect to factoring page if authenticated and on login page
      router.replace('/factoring');
    }
  }, [router, isLoginPage]);

  // Don't render anything while checking authentication
  if (isCheckingAuth) {
    return null;
  }

  // Don't render protected content if not authenticated
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <>
      {!isLoginPage && <Header />}
      {!isLoginPage && <Navbar />}
      <main>
        {children}
      </main>
      {!isLoginPage && <footer>Footer</footer>}
    </>
  );
}