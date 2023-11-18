import React, { useContext, useState } from 'react';
import { StrogeData } from '../Context';
import AddToCartProduct from '../components/AddToCartProduct/AddToCartProduct';
import CartSidebar from '../components/CartSidebar/CartSidebar';

const Cart = () => {
   const { product } = useContext(StrogeData);
   const [cartCount, setCartCount] = product
   const [pTAmount, setPTAmount] = useState()

   const cartTotal = (productAmount, sign, count) => {
      let cartDetails = {
         amount: productAmount,
         sign: sign,
      }
      setPTAmount(cartDetails)
   }

   console.log(cartCount);
   return (
      <div className='Cart'>
         <div className="container">
            <div className="row py-5">
               <div className="col-lg-8 col-md-7">
                  <div style={{ background: '#fff', padding: '30px'}}>
                     <h2 className='mb-3' style={{fontSize: '25px'}}>Cart</h2>
                    <div style={{overflowX: 'auto'}}>
                     <table className='table table-bordered'>
                        <thead>
                           <tr>
                              <th>Product</th>
                              <th>Image</th>
                              <th>Price</th>
                              <th>Stock Status</th>
                              <th>Quantity</th>
                              <th>Delete</th>
                           </tr>
                        </thead>
                        <tbody>
                           {
                              cartCount ? cartCount.map((elem) => {
                                 return (
                                    <>
                                       <tr>
                                          <AddToCartProduct cartProduct={elem} key={elem.id} cartTotal={cartTotal} />
                                       </tr>
                                    </>
                                 )
                              })
                                 :
                                 'Product Not Added In Cart'
                           }
                        </tbody>
                     </table>
                     </div>
                  </div>
               </div>
               <div className="col-lg-4 col-md-5">
                  <CartSidebar cartDetails={pTAmount} />
               </div>
            </div>
         </div>
      </div>
   );
};

export default Cart;


