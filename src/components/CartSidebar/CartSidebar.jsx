import React, { useContext, useEffect, useState } from 'react';
import './CartSidebar.css';
import { StrogeData } from '../../Context';

const CartSidebar = ({ cartDetails }) => {
  const {product} = useContext(StrogeData);
    const [cartCount, setCartCount] = product
  const [subTotal, setSubTotal] = useState(0)
  const [countValue, setCountValue] = useState(0)

  const countTotal = Object.entries(cartCount).reduce(function (total, pair) {
    const [key, value] = pair;
    return total + value.price
  }, 0);

  useEffect(() => {
    setSubTotal(Math.floor(countTotal))
  }, [cartCount])

  useEffect(() => {
    if (cartDetails) {
      const { sign, amount } = cartDetails;
      if (sign === 'plus') {
        setSubTotal(subTotal + amount);
        setCountValue(countValue + 1)
      } else if (sign === 'minus') {
        setSubTotal(subTotal - amount)
        setCountValue(countValue - 1)
      }
    }
  }, [cartDetails])
  
  return (
    <div className='cartsidebar'>
      <h2>Order Summary</h2>
      <h6>subtotal: <span>${subTotal}</span></h6>
      <h6>Shipping: <span>$15</span></h6>
      <h6>Total: <span>${cartCount? (subTotal + cartCount.length * 15 + countValue * 15): (0)}</span></h6>
      <button>Checkout</button>
    </div>
  );
};

export default CartSidebar;