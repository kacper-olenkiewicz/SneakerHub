"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './header.module.css';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();

    const handleAuthChange = () => fetchSession();
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('focus', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, [fetchSession]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      window.localStorage.removeItem('cart');
      setUser(null);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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
