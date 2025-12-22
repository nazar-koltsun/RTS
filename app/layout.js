'use client';

import './globals.css';
import ConditionalLayout from './components/ConditionalLayout';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={cn(!isLoginPage ? 'page-layout' : '')}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
