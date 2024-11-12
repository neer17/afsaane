'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';
import Link from 'next/link';
import CartSVG from '@/app/svgs/cart.svg';

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Collections', path: '/' },
  { name: 'Earrings', path: '/shop' },
  { name: 'Rings', path: '/new-launch' },
  { name: 'Pendants', path: '/navratri-special' },
];

const NavigationBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenuItemExpanded, setMobileMenuItemExpanded] = useState<string | null>(null);
  const [desktopMenuItemHovered, setDesktopMenuItemHovered] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'unset' : 'hidden';
  };

  const handleMobileMenuItemsExpand = (menuItemName: string) => {
    if (mobileMenuItemExpanded === menuItemName) {
      return setMobileMenuItemExpanded(null);
    }
    setMobileMenuItemExpanded(menuItemName);
  };

  const handleDesktopMenuItemsMouseOver = (menuItemName: string) => {
    if (desktopMenuItemHovered == menuItemName) {
      return setDesktopMenuItemHovered(null);
    }
    setDesktopMenuItemHovered(menuItemName);
  };

  const handleDesktopMenuItemsMouseOut = () => {
    setDesktopMenuItemHovered(null);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          {/* Hamburger button */}
          <button onClick={toggleMenu} className={styles.mobileMenuButton} aria-label="Menu">
            <div className={styles.hamburgerIcon}>
              <span className={styles.hamburgerBar}></span>
              <span className={styles.hamburgerBar}></span>
              <span className={styles.hamburgerBar}></span>
            </div>
          </button>

          <div className={styles.brandName}>
            <Link href="/">Afsaane</Link>
          </div>

          {/* Desktop navbar menu items */}
          <div className={styles.desktopMenu}>
            <div className={styles.menuItems}>
              {menuItems.map((item) => (
                <span className={styles.menuItemContainer} key={item.name}>
                  <div
                    className={styles.menuItemNameContainer}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      handleDesktopMenuItemsMouseOver(item.name);
                    }}
                    onMouseLeave={handleDesktopMenuItemsMouseOut}
                  >
                    <Link href={item.path} className={styles.menuItem}>
                      {item.name}
                    </Link>
                    <div className="underline-animation"></div>
                  </div>

                  {desktopMenuItemHovered === item.name && (
                    <div className={styles.desktopMenuItemPanel}>
                      <div className={styles.desktopMenuItemPanelGrid}>
                        <div className={styles.desktopMenuItemPanelColumn}>
                          <h3>SHOP BY SIZE</h3>
                          <ul>
                            <li>Carry-Ons</li>
                            <li>Checked</li>
                            <li>Compare Carry-Ons</li>
                            <li>Compare checked</li>
                          </ul>
                        </div>
                        <div className={styles.desktopMenuItemPanelColumn}>
                          <h3>SHOP BY MATERIAL</h3>
                          <ul>
                            <li>Hardside</li>
                            <li>Softside</li>
                            <li>Aluminum</li>
                            <li>Compare materials</li>
                          </ul>
                        </div>
                        <div className={styles.desktopMenuItemPanelColumn}>
                          <h3>FEATURED</h3>
                          <ul>
                            <li>Save on luggage sets</li>
                            <li>The Café Edit</li>
                            <li>Softside luggage</li>
                            <li>Flex: Expandable luggage</li>
                          </ul>
                        </div>
                        <div className={styles.mobileMenuItemExpandablePanelImageColumn}>
                          <Image
                            width={300}
                            height={200}
                            src="https://images.pexels.com/photos/60597/dahlia-red-blossom-bloom-60597.jpeg?auto=compress&cs=tinysrgb&w=1200&h=750&dpr=2"
                            alt="Luggage image"
                            className={styles.desktopMenuItemPanelFeaturedImage}
                          ></Image>
                          <p className={styles.mobileMenuItemExpandablePanelCaption}>
                            FIT FOR EVERY TRIP. SHOP SUITCASES &rarr;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.cartContainer}>
            <Image src={CartSVG} alt="Cart" width={25} height={25} />
          </div>
        </div>
      </nav>

      {/* Mobile navbar menu items*/}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <span className={styles.menuTitle}>Menu</span>
          <button onClick={toggleMenu} className={styles.closeButton} aria-label="Close menu">
            <span className={styles.closeBar}></span>
            <span className={styles.closeBar}></span>
          </button>
        </div>

        <div className={styles.menuItems}>
          {menuItems.map((item) => (
            <span key={item.name} className={styles.menuItem} onClick={() => handleMobileMenuItemsExpand(item.name)}>
              <div className={styles.mobileMenuItem}>
                <div>
                  <span>{item.name} &#9660;</span>
                </div>

                {mobileMenuItemExpanded === item.name && (
                  <div className={styles.mobileMenuItemExpandablePanel}>
                    <div className={styles.imagesContainer}>
                      <span className={styles.image}></span>
                      <span className={styles.image}></span>
                      <span className={styles.image}></span>
                      <span className={styles.image}></span>
                    </div>

                    <div>
                      <div className={styles.moreFiltersPanel}>
                        <div className={styles.moreFilterContainer}>
                          <h3>SHOP BY METAL</h3>
                          <ul>
                            <li>Silver Bracelets</li>
                            <li>Brass Bracelets</li>
                          </ul>
                        </div>
                        <div className={styles.moreFilterContainer}>
                          <h3>CURATED BY</h3>
                          <ul>
                            <li>Everyday Bracelets</li>
                            <li>Cuff Bracelets</li>
                            <li>Gold Plated Bracelets</li>
                            <li>Palm Cuffs</li>
                            <li>Black Bead Bracelets</li>
                            <li>Bracelets Under 2K</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
