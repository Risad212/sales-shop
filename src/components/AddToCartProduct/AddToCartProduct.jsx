import React, { useContext, useEffect, useState } from 'react';
import './AddToCartProuduct.css'
import {StrogeData} from '../../Context';

const AddToCartProduct = ({ cartProduct,cartTotal }) => {
   const {product} = useContext(StrogeData);
    const [cartCount, setCartCount] = product
   const [count, setCount] = useState(1)
   const [sign, setSign] = useState(null);

   const removeItem = (id) => {
     const filterItem = cartCount.filter((elem) => {
          return elem.id !== id;
     })
     setCartCount(filterItem)
   }
  
   useEffect(() => {
      cartTotal(Math.floor(cartProduct.price),sign);
   },[count])

   const {title,image,price,id} = cartProduct

   return (
      <>
       <td>{title?.substring(0, 12)}</td>
         <td><img src={image} style={{width: '70px', height: '70px',}} alt={title} /></td>
         <td>{price}</td>
         <td>In Stock</td>
         <td>
         <div className='input d-flex align-items-center'>
               <button onClick={() => {
                  if (count >= 2) {
                     setCount(count - 1);
                     setSign('minus')
                  } else {
                     setCount(count);
                     setSign('minus')
                  }
               }}>-</button>
               <span>{count}</span>
               <button onClick={() => [setCount(count + 1),setSign('plus')]}>+</button>
            </div>
         </td>
         <td><h5 className='ms-2 remove-item' onClick={(e) => removeItem(cartProduct?.id)}><i class="fa-solid fa-xmark"></i></h5></td>  
      </>
   );
};

export default AddToCartProduct;



