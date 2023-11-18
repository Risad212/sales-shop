import React from 'react';
import BlogSidebar from '../components/BlogSIdebar/BlogSidebar';
import WishProduct from '../components/WishProduct/WishProduct'

const Wishlist = () => {
    return (
        <div className='wishlist'>
           <div className="container">
               <div className="row py-5">
                  <div className="col-lg-8 col-md-12">
                     <WishProduct />
                  </div>
                  <div className="col-lg-4 col-md-12">
                     <BlogSidebar />
                  </div>
               </div>
           </div>
        </div>
    );
};

export default Wishlist;