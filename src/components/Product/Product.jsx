import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StrogeData } from '../../Context';
import './Product.css';

const Product = ({ item}) => {
    let location = useLocation();
    const [saved,setSaved] = useState('fa-regular')
    const {product,wishCart} = useContext(StrogeData);
    const [cartCount, setCartCount] = product
    const [wishItem, setWishItem] = wishCart

    // set product in cart
    const addToCart = () => {
          if(cartCount){
            let filterData = cartCount.filter((elem) => {
                return elem.id !== item.id
             })
             setCartCount([...filterData,item])
          }else{
            setCartCount([...item])
          }
    }

    // set product in wishlist
    const setWishProduct = () => {
        if(wishItem){
            let filterWish = wishItem.filter((elem) => {
                return elem?.id !== item?.id
            })
            setWishItem([...filterWish,item])
            setSaved('fa-solid')
        }else{
            setWishItem([...item])
        }
    }
    return (
        <>
            <div className={`${location.pathname === '/shop'? 'col-lg-4': 'col-lg-3'} 
                             col-md-6 col-sm-12 mb-4`} key={item?.id}>
                <div class="card h-100 text-center p-4">
                    <Link to={'/product/' + item?.id}>
                        <img src={item?.image} class="card-img-top" alt={item?.title} height="200px" />
                    </Link>
                    <div class="card-body">
                        <h5 class="card-title fw-bold">{item?.title.substring(0, 12)}</h5>
                        <p class="card-text lead fw-bold">${item?.price}</p>
                        <button class="btn btn-outline-dark px-4" onClick={() => addToCart()}>Add To Cart</button>
                        <button class="btn btn-outline-dark px-2 border-start-0" onClick={() => setWishProduct()}>
                           <i class={`${saved} fa-heart`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;