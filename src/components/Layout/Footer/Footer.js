import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <p className={styles.footerText}>
        © 2024 James Han. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;
