import React from 'react'
import CartStyle from './Cart.module.css'
import { useEffect } from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify';

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cart", {
          credentials: "include",
        });
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCart();
  }, []);

   const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const deleteItem=async(id)=>{
    const res = await fetch("http://localhost:3000/api/cart/remove", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productID: id })
    });

    const data=await res.json();

    if (res.ok) {
      
      setCartItems(data.cart.items);
    } else {
      toast.error(data.message);
    }

  }

  const QytUp=async(id,action)=>{
        try{
            const res=await fetch('http://localhost:3000/api/cart/update-qty',{
                method:'POST',
                credentials:'include',
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify({productID:id,action})
            })

            const data=await res.json();

            if (res.ok) {
            setCartItems(data.cart.items);
            } else {
            toast.error(data.message);
            }
            
        }catch(err) {
            console.error(err);
            toast.error("Server error");
        }
  }


  const hadleOrder=async(e)=>{
      e.preventDefault()
      const paymentMethod=document.querySelector('input[name="payment"]:checked')?.id;
      console.log(paymentMethod);
      

      if(!paymentMethod){
        return toast.error('Please Seclect the Payment Option')
      }

      try{
          const res=await fetch('http://localhost:3000/api/order',{
            method:'POST',
            credentials:'include',
            headers: { "Content-Type": "application/json" },
            body:JSON.stringify({
              items:cartItems,
              total:getTotal(),
              paymentMethod
            })
          })

          const data=await res.json();
          if (res.ok) {
            toast.success(data.message);   // show success
            setCartItems([]);              // clear cart in frontend
          } else {
            toast.error(data.message);     // show error
          }
      }catch (err) {
        console.error(err);
        toast.error("Server error");
      }
  }
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
        
        <div className={CartStyle.CartHeader}>
        <span>Product</span>
        <span>Quantity</span>
        <span>Price</span>
        <span>Subtotal</span>
        </div>

            {
                
                cartItems.map((item,index)=>(
                    <div className={CartStyle.CartContainer}>
                    <>
                            <img src={item.image} alt={item.productName} />
                            <span className={CartStyle.Name}>{item.productName}</span>
                            
                            <span className={CartStyle.Quantity}>{item.quantity}</span>
                            <span className={CartStyle.TotPrice}>{item.price}/kg</span>
                            <div className={CartStyle.BtnSec}>
                                <button onClick={()=>QytUp(item._id,'dec')}>-</button>
                                <input type="text" value={item.quantity} disabled />
                                <button onClick={()=>QytUp(item._id,'inc')}>+</button>
                            </div>
                            <button className={CartStyle.deleteBtn} onClick={()=>deleteItem(item._id)}>Remove</button>
                    </>
                    </div>
                ))
                
            }
            <div className={CartStyle.TotAmontSec}>Total Amount: {getTotal()}</div>
            {cartItems.length&&<div className={CartStyle.BuySec}>
              <div className={CartStyle.Payement}>
                <span className={CartStyle.cash}>
                  <input type="radio" name="payment" id="cash" />
                  <span><label htmlFor="#cash">Cash On Delivery</label></span>
                </span>

                <span className={CartStyle.upi}>
                  <input type="radio" name="payment" id="upi" />
                  <span>UPI Payment</span>
                </span>

                <button className={CartStyle.BuyBtn} onClick={hadleOrder}>BUY</button>
              </div>
            </div>}
            
        
    </div>
  )
}

export default Cart