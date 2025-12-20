'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <header>Header</header>}
      {!isLoginPage && <aside>Navbar</aside>}
      {children}
      {!isLoginPage && <footer>Footer</footer>}
    </>
  );
}
