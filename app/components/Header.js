'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import styles from './Header.module.css';

const Header = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { label: 'Overview', href: '/factoring' },
    { label: 'Invoices', href: '/' },
    { label: 'Reports', href: '/' },
    { label: 'FAQ', href: '/' },
  ];

  const userMenuItems = [
    { label: 'Administration', href: '/' },
    { label: 'Contact Us', href: '/' },
    { label: 'Settings', href: '/' },
    { label: 'Help Center', href: '/' },
    { label: 'ProTransport EULA', href: '/' },
    { label: 'Log Out', href: '/login', action: 'logout' },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('supabaseSession');
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerOrg}>
          <p className={styles.headerOrgName}>
            118170REC - AAA EXPRESS INC. (MC # 1063135)
          </p>
          <Image src="/caretdown.svg" alt="Logo" width={6} height={4} />
        </div>
      </div>

      <div className={styles.headerBottom}>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                styles.navLink,
                isActive(item.href) && styles.navLinkActive
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.userInfoWrapper} ref={dropdownRef}>
          <div className={styles.userInfo} onClick={toggleDropdown}>
            <span className={styles.userName}>Petro Shtohryn</span>
            <Image
              src="/caretdown.svg"
              alt="Dropdown"
              width={6}
              height={4}
              className={cn(
                styles.caretIcon,
                isDropdownOpen && styles.caretIconRotated
              )}
            />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdown}>
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.dropdownItem}
                  onClick={(e) => {
                    if (item.action === 'logout') {
                      e.preventDefault();
                      handleLogout();
                    }
                    setIsDropdownOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
