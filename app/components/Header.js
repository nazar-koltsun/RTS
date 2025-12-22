import Image from 'next/image';
import styles from './Header.module.css';

const Header = () => {

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.headerOrg}>
          <p className={styles.headerOrgName}>118170REC - AAA EXPRESS INC. (MC # 1063135)</p>
          <Image src="/caretdown.svg" alt="Logo" width={6} height={4} />
        </div>
      </div>




      {/* <button
        onClick={async () => {
          // Remove authentication state from localStorage
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('supabaseSession');
          // Log out from Supabase
          const { supabase } = await import('@/lib/supabase');
          await supabase.auth.signOut();
          // Optionally reload or redirect to login page
          window.location.href = '/login';
        }}
      >
        Log out
      </button> */}
      
    </header>
  );
};

export default Header;
