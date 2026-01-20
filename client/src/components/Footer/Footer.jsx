import React from 'react';
import styles from './Footer.module.css';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className={styles.footer}>
      {/* About Section */}
      <div className={styles.footerSection}>
        <h3>Amma Vegetable</h3>
        <p>Fresh vegetables delivered from Trivandrum to your doorstep.</p>
      </div>

      {/* Contact Section */}
      <div className={styles.footerSection}>
        <h3>Contact Us</h3>
        <div className={styles.contactItem}>
          <FaPhoneAlt /> <span>9090909090</span>
        </div>
        <div className={styles.contactItem}>
          <FaEnvelope /> <a href="mailto:ammaveg@gmail.com">ammaveg@gmail.com</a>
        </div>
        <p>Address: Amma Vegetable, Trivandrum, 69566X</p>
      </div>

      {/* Quick Links */}
      <div className={styles.footerSection}>
        <h3>Quick Links</h3>
        <p><a href="/terms">Terms & Conditions</a></p>
        <p><a href="#">Privacy Policy</a></p>
        <p><a href="#">About Us</a></p>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        &copy; {new Date().getFullYear()} Amma Vegetable, Trivandrum. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
