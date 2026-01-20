import React from 'react';
import styles from './Banner.module.css';


function Banner() {
  return (
    <div
      className={styles.banner} style={{ backgroundImage: `url(/banner_copy.png)` }}>

      {/* <div className={styles.overlayText}>
        Fresh Vegetables in One Platform
      </div> */}
    </div>
  );
}

export default Banner;
