'use client';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Copyright © {new Date().getFullYear()} | RTS Financial
      </p>
    </footer>
  );
};

export default Footer;
