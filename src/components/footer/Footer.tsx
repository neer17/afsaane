import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.infoContainer}>
        <div className={styles.shopContainer}>
          <h4>Shop</h4>
          <h5>Best Sellers</h5>
          <h5>Best Sellers</h5>
          <h5>Best Sellers</h5>
          <h5>Best Sellers</h5>
          <h5>Best Sellers</h5>
          <h5>Best Sellers</h5>
        </div>
        <div className={styles.aboutContainer}>
          <h4>About</h4>
          <h5>Out Story</h5>
          <h5>Out Story</h5>
          <h5>Out Story</h5>
          <h5>Out Story</h5>
          <h5>Out Story</h5>
          <h5>Out Story</h5>
        </div>
        <div className={styles.helpContainer}>
          <h4>Get Help</h4>
          <h5>Order Tracking</h5>
          <h5>Order Tracking</h5>
          <h5>Order Tracking</h5>
          <h5>Order Tracking</h5>
          <h5>Order Tracking</h5>
          <h5>Order Tracking</h5>
        </div>
        <div className={styles.faqContainer}>
          <h4>FAQs</h4>
          <h5>ALL FAQs</h5>
          <h5>Warrant & repair</h5>
          <h5>Icons of social media</h5>
        </div>
      </div>
      <div className={styles.signupContainer}>
        <h3>Sign up for our emails</h3>
        <h5>We’ll send you updates on our latest launches and more. Need to take off? Unsubscribe at any time.</h5>
        <div className={styles.emailAddressContainer}>
          <input type="text" placeholder="Email address"></input>
          <button></button>
        </div>
        <h5>
          Sign up for our emails We’ll send you updates on our latest launches and more. Need to take off? Unsubscribe
          at any time. Email address Newsletter email submit By clicking submit, you agree to our Privacy Policy and
          Terms. We’ll send you updates on all things Away. Need to take off? Unsubscribe anytime.
        </h5>
      </div>
    </div>
  );
}
