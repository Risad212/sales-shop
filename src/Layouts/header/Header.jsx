import React, { useContext, useEffect, useState } from 'react';
import './header.css';
import { StrogeData } from '../../Context';
import { Link } from 'react-router-dom';
import Logo from '../../Media/logo.png';

const Header = () => {
  const [navStyle, setNavStyle] = useState({ left: '-1000px' })
  const { product, wishCart } = useContext(StrogeData);
  const [cartCount, setCartCount] = product
  const [wishItem, setWishItem] = wishCart
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const countTotal = Object.entries(cartCount).reduce(function (total, pair) {
      const [key, value] = pair;
      return total + value.price
    }, 0);
    setTotalPrice(Math.floor(countTotal))
  }, [cartCount])

  return (
    <>
      <div class="topbar">
        <div class="container">
          <div class="topbar-wrapper">
            <div class="info">
              <span><i class="fa-solid fa-phone"></i> 1-284-676-2886</span>
              <span><i class="fa-solid fa-envelope"></i> info@salesshop.com</span>
            </div>
            <div class="social">
              <a href="#"><span><i class="fa-brands fa-facebook-f"></i></span></a>
              <a href="#"><span><i class="fa-brands fa-twitter"></i></span></a>
              <a href="#"><span><i class="fa-brands fa-instagram"></i></span></a>
              <a href="#"><span><i class="fa-brands fa-youtube"></i></span></a>
            </div>
          </div>
        </div>
      </div>
      <div className='navbar'>
        <div className="container">
          <Link to="/" className='logo'><img src={Logo} alt="" /></Link>
          <i class="fa-solid fa-bars menu-bar" onClick={() => setNavStyle({ left: '0px' })}></i>
          <div className="menu" style={navStyle}>
            <i class="fa-solid fa-xmark remove-bar ms-auto" onClick={() => setNavStyle({ left: '-1000px' })}></i>
            <ul className='navbar-list'>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='shop'>Shop</Link></li>
              <li><Link to='/cart'>Cart</Link></li>
              <li><Link to='/wishlist'>Wishlist</Link></li>
              <li><Link to='/contact'>Contact</Link></li>
            </ul>
            <div className='position-relative'>
              <button className='btn btn-outline-dark me-2 navBtn'>My Account</button>
              <Link to="/wishlist">
                <i class="fa-sharp fa-regular fa-heart me-4 ms-1"></i>
                <span className='wishList-icon'>{wishItem?.length}</span>
              </Link>
              <Link to="/cart"><span className='pe-1 ps-1 fw-bold'>${cartCount ? totalPrice : 0.00}</span>
                <i class="fa-solid fa-cart-shopping"></i>
                <span className='shoping-icon'>{cartCount?.length}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;