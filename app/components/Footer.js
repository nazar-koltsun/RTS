'use client';

import styles from './Footer.module.css';
import Button from './Button';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        <strong>Unlock the power of ProTransport.</strong> Access PT Premium or
        Enterprise instantly, no contracts, cancel anytime.
      </p>
      <div className={styles.actions}>
        <Button className={styles.button}>Learn More or Subscribe</Button>
        <button className={styles.closeButton} aria-label="Close banner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <path
              d="M16 1.66005L14.3848 0.0467529L8 6.42386L1.61524 0.0467529L0 1.66005L6.38476 8.03716L0 14.4143L1.61524 16.0276L8 9.65046L14.3848 16.0276L16 14.4143L9.61524 8.03716L16 1.66005Z"
              fill="#BDBDBD"
            />
          </svg>
        </button>
      </div>
      <Image
        src="/footer-decor.svg"
        alt="Footer Decor"
        className={styles.decor}
        width={170}
        height={61}
      />
    </footer>
  );
};

export default Footer;
