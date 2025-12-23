'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import styles from './Navbar.module.css';

const NavItem = ({ label, addLabel, icon, href, isActive }) => {
  return (
    <li className={cn(styles.navItem, isActive && styles.navItemActive)}>
      <Link href={href} className={styles.navItemLink}>
        {icon && (
          <Image
            src={icon}
            alt={label}
            width={15}
            height={15}
            className={styles.navItemIcon}
          />
        )}
        <div className={styles.navItemLabelWrapper}>
          <span className={styles.navItemLabel}>{label}</span>
          {addLabel && <span className={cn(styles.navItemLabel, styles.navItemAddLabel)}>{addLabel}</span>}
        </div>
      </Link>
    </li>
  );
};

const Navbar = () => {
  const navItems = [
    { label: 'Credit Search', icon: '/credit-search.svg', href: '/' },
    { label: 'Freight', icon: '/freight.svg', href: '/' },
    { label: 'Fuel', icon: '/fuel.svg', href: '/' },
    { label: 'Factoring', icon: '/factoring.svg', href: '/factoring/home' },
    {
      label: 'ProTransport',
      addLabel: 'BASIC',
      icon: '/protransport-basic.svg',
      href: '/',
    },
    { label: 'Banking', icon: '/banking.svg', href: '/' },
  ];

  const pathname = usePathname();

  return (
    <aside className={styles.navbar}>
      <Image
        src="/logo-white.svg"
        className={styles.logo}
        alt="RTS Pro Web"
        width={101}
        height={21}
      />

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              addLabel={item.addLabel}
              icon={item.icon}
              href={item.href}
              isActive={
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              }
            />
          ))}
        </ul>
      </nav>

      <button className={styles.feedbackBtn}>
        <Image
          src="/feedback.svg"
          alt="Feedback"
          width={15}
          height={15}
          className={styles.feedbackBtnIcon}
        />
        Feedback
      </button>

      <button className={styles.toggleNavBtn}>
        <Image
          src="/left-arrow-icon.svg"
          alt="Toggle Navigation"
          width={30}
          height={30}
          className={styles.toggleNavBtnIcon}
        />
      </button>

    </aside>
  );
};

export default Navbar;
