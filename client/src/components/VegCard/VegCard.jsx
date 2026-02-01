import React from "react";
import styles from "./VegCard.module.css";
import { toast } from "react-toastify";

const VegCard = ({ veg }) => {

  const addCart=async(product)=>{
      try {
        const res = await fetch('http://localhost:3000/api/cart/add', {
          method: 'POST',
          credentials: 'include', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ProdName: product.name,
            ProdImage: product.image,
            ProdPrice: product.price,
            ProdQuantity: 1
          })
        });

        const data=await res.json()
        if (res.ok) {
          toast.success('Added to cart!');
        } else {
          toast.error(data.message || 'Failed to add to cart');
        }
      }catch(err){
       console.error(err);
    toast.error('Server error'); 
      }
  }
  return (
    <div className={styles.card}>
      <img src={veg.image} alt={veg.name} className={styles.image} />
      <div className={styles.details}>
        <h3>{veg.name}</h3>
        <p>Stock: {veg.quantity}</p>
        <p className={styles.price}>₹ {veg.price} / kg</p>
        <button className={styles.btn} onClick={()=>addCart(veg)}>Add to Cart</button>
      </div>
    </div>
  );
};

export default VegCard;
