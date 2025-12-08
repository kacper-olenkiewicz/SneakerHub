"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

const readUserSnapshot = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem('user');
  } catch (error) {
    console.error('Failed to read user session', error);
    return null;
  }
};

const subscribeToUserChanges = (callback) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleChange = () => callback();

  window.addEventListener('storage', handleChange);
  window.addEventListener('auth-change', handleChange);
  window.addEventListener('focus', handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener('auth-change', handleChange);
    window.removeEventListener('focus', handleChange);
  };
};

export default function Header() {
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeToUserChanges,
    readUserSnapshot,
    () => null
  );
  const user = useMemo(() => {
    if (!userSnapshot) {
      return null;
    }

    try {
      return JSON.parse(userSnapshot);
    } catch (error) {
      console.error('Failed to parse user snapshot', error);
      return null;
    }
  }, [userSnapshot]);

  const handleLogout = () => {
    window.localStorage.removeItem('user');
    window.localStorage.removeItem('cart');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  const dashboardHref = user?.role === 'WORKER' ? '/worker' : '/dashboard';
  const dashboardLabel = user?.role === 'WORKER' ? 'Worker Panel' : 'Dashboard';

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoContainer}>
            <Image 
              src="/logo.png" 
              alt="SneakerHub Logo" 
              fill
              sizes="40px"
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
          {user ? (
            <>
              <li className={styles.navItem}>
                <Link href={dashboardHref} className={styles.dashboardButton}>
                  {dashboardLabel}
                </Link>
              </li>
              <li className={styles.navItem}>
                <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className={styles.navItem}>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
