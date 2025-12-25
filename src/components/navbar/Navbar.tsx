"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Navbar.module.css";
import Link from "next/link";
import CartSVG from "@/app/svgs/cart.svg";
import WishlistSVG from "@/app/svgs/wishlist.svg";
import UserSVG from "@/app/svgs/user.svg";
import { useCart, useWishlist } from "@/context/CartContext";
import { v4 as uuid } from "uuid";
import SignInModal from "@/components/modal/SignIn";
import OTPModal from "@/components/modal/OTPVerification";
import { OtpService } from "@/lib/services/otpService";

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: "Collections", path: "/" },
  { name: "Earrings", path: "/shop" },
  { name: "Rings", path: "/new-launch" },
  { name: "Pendants", path: "/navratri-special" },
];

const NavigationBar: React.FC = () => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { cartData } = useCart();
  const { wishlistData } = useWishlist();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [mobileMenuItemExpanded, setMobileMenuItemExpanded] = useState<
    string | null
  >(null);
  const [desktopMenuItemHovered, setDesktopMenuItemHovered] = useState<
    string | null
  >(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? "unset" : "hidden";
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

  const handleUserSignIn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    setShowSignInModal(true);
  };

  const handleInputChange = (input: string) => {
    setPhoneNumber(input);
  };

  const handleSendOtp = async (phoneNumber: string) => {
    let response;
    try {
      response = await OtpService.sendOtp(phoneNumber);
    } catch (error) {
      console.error("Error in sending OTP: ", { error });
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Show error message to wait certain minutes before requesting for OTP again
      if (
        response.status == 400 &&
        String(errorData.error).includes("Please wait")
      ) {

      }

      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    setShowOTPModal(true);
  };

  const handleModalClose = () => {
    setShowSignInModal(false);
  };

  const handleVerifyOtp = async (otp: string) => {
    let response;
    try {
      response = await OtpService.verifyOtp(phoneNumber, otp);
    } catch (error) {
      console.error("Error in verifying OTP: ", { error });
      throw error;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // TODO: fetch user and save in local storage

    setShowSignInModal(false)
    setShowOTPModal(false)
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          {/* Hamburger button */}
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
            <Link href="/">Qala Chowk</Link>
          </div>

          {/* Desktop navbar menu items */}
          <div className={styles.desktopMenu}>
            <div className={styles.menuItems}>
              {menuItems.map((item) => (
                <span className={styles.menuItemContainer} key={uuid()}>
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
                        <div
                          className={
                            styles.mobileMenuItemExpandablePanelImageColumn
                          }
                        >
                          <Image
                            width={300}
                            height={200}
                            src="https://images.pexels.com/photos/60597/dahlia-red-blossom-bloom-60597.jpeg?auto=compress&cs=tinysrgb&w=1200&h=750&dpr=2"
                            alt="Luggage image"
                            className={styles.desktopMenuItemPanelFeaturedImage}
                          ></Image>
                          <p
                            className={
                              styles.mobileMenuItemExpandablePanelCaption
                            }
                          >
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

          <Link href="/signin" className={styles.signinContainer}>
            <Image
              src={UserSVG}
              alt="Sign In"
              width={25}
              height={25}
              onClick={handleUserSignIn}
            />
          </Link>

          <Link href="/wishlist" className={styles.wishlistContainer}>
            <Image src={WishlistSVG} alt="Wishlist" width={25} height={25} />
            <span className={styles.cartItemsIndicator}>
              {wishlistData.size}
            </span>
          </Link>

          <Link href="/cart" className={styles.cartContainer}>
            <Image src={CartSVG} alt="Cart" width={25} height={25} />
            <span className={styles.cartItemsIndicator}>{cartData.size}</span>
          </Link>
        </div>
      </nav>

      {/* Mobile navbar menu items*/}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}>
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
            <span
              key={uuid()}
              className={styles.menuItem}
              onClick={() => handleMobileMenuItemsExpand(item.name)}
            >
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

      {/* Modals */}
      {showSignInModal && (
        <SignInModal
          onClose={handleModalClose}
          inputChangeCallback={handleInputChange}
          sendOTPCallback={handleSendOtp}
        />
      )}
      {showOTPModal && (
        <OTPModal
          opened={true}
          handleCloseModal={() => setShowOTPModal(false)}
          phoneNumber={phoneNumber}
          verifyOtpCallback={handleVerifyOtp}
        />
      )}
    </>
  );
};

export default NavigationBar;
