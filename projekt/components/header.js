import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoContainer}>
            <Image 
              src="/logo.png" 
              alt="SneakerHub Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className={styles.logoText}>SneakerHub</span>
        </Link>
        
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/buy" className={styles.navLink}>
              All Products
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/sneakers" className={styles.navLink}>
              Sneakers
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/winter" className={styles.navLink}>
              Winter
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/contact" className={styles.navLink}>
              Contact
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/login" className={styles.loginButton}>
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
