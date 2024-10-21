'use client'

import React, { useState } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'HOME', path: '/' },
  { name: 'SHOP', path: '/shop' },
  { name: 'NEW LAUNCH', path: '/new-launch' },
  { name: 'NAVRATRI SPECIAL', path: '/navratri-special' },
  { name: 'FESTIVE HAMPERS', path: '/festive-hampers' },
  { name: 'CLEARANCE SALE', path: '/clearance-sale' },
  { name: 'DIWALI SALE', path: '/diwali-sale' },
];

const NavigationBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'unset' : 'hidden';
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <button
            onClick={toggleMenu}
            className={styles.mobileMenuButton}
            aria-label="Menu"
          >
            <div className={styles.hamburgerIcon}>
              <span className={styles.hamburgerBar}></span>
              <span className={styles.hamburgerBar}></span>
              <span className={styles.hamburgerBar}></span>
            </div>
          </button>

          <div className={styles.brandName}>
            <Link href="/">BRAND NAME</Link>
          </div>
        </div>
      </nav>

      <div
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}
      >
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button
            onClick={toggleMenu}
            className={styles.closeButton}
            aria-label="Close menu"
          >
            <span className={styles.closeBar}></span>
            <span className={styles.closeBar}></span>
          </button>
        </div>

        <div className={styles.menuItems}>
          {menuItems.map((item) => (
            <Link key={item.name} href={item.path} className={styles.menuItem}>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
