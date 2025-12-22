'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useEffect,
  useSyncExternalStore,
  useState,
  startTransition,
} from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

// Subscribe to localStorage changes for authentication status
function subscribeToAuthStatus(callback) {
  // Listen for storage events (changes from other tabs/windows)
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
    return () => {
      window.removeEventListener('storage', callback);
    };
  }
  return () => {};
}

function getAuthStatus() {
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
  const [isMounted, setIsMounted] = useState(false);

  // Use useSyncExternalStore to subscribe to localStorage changes
  // This prevents hydration mismatches and follows React best practices
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthStatus,
    getAuthStatus,
    () => false // Server-side fallback (always false to match initial client render)
  );

  // Track when component has mounted (after hydration)
  // Use startTransition to defer state update and avoid linter warning
  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    // Only handle redirects after component has mounted to avoid flash
    if (!isMounted) return;

    // Handle redirects based on auth status
    if (!isAuthenticated && !isLoginPage) {
      // Redirect to login page if not authenticated
      router.replace('/login');
    } else if (isAuthenticated && isLoginPage) {
      // Redirect to factoring page if authenticated and on login page
      router.replace('/factoring');
    }
  }, [router, isLoginPage, isAuthenticated, isMounted]);

  // Show nothing until mounted to prevent flash of wrong content
  if (!isMounted) {
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
      <main>{children}</main>
      {!isLoginPage && <Footer />}
    </>
  );
}
