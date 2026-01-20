import React from "react";
import styles from "./VegCard.module.css";

const VegCard = ({ veg }) => {
  return (
    <div className={styles.card}>
      <img src={veg.image} alt={veg.name} className={styles.image} />
      <div className={styles.details}>
        <h3>{veg.name}</h3>
        <p>Stock: {veg.quantity}</p>
        <p className={styles.price}>₹ {veg.price} / kg</p>
        <button className={styles.btn}>Add to Cart</button>
      </div>
    </div>
  );
};

export default VegCard;
