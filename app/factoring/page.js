'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Factoring() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [router]);

  // Check authentication before rendering
  if (typeof window !== 'undefined') {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      return null; // Don't render anything while redirecting
    }
  }

  return <div>Factoring page</div>;
}
