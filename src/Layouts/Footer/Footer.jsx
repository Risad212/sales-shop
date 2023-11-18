import React from 'react'
import { Link } from 'react-router-dom';
import Logo from '../../Media/footer-logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <>
            <footer>
                <div class="container">
                    <div class="row g-4">
                        <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInLeft" data-wow-delay=".9s" data-wow-duration=".4s">
                            <Link><img className='mb-4' src={Logo} alt="" /></Link>
                             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt odio iure animi ullam quam, deleniti rem!</p>
                        </div>
                        <div class="col-lg-2 col-md-6 col-sm-12 wow fadeInLeft" data-wow-delay=".7s" data-wow-duration=".3s">
                            <h4 class="footer-head mb-4">Quick Links</h4>
                            <ul class="unstyle-link">
                                <li><a href="about.html">Home</a></li>
                                <li><a href="trip.html">Shop</a></li>
                                <li><a href="blog.html">Cart</a></li>
                                <li><a href="blog.html">Wishlist</a></li>
                                <li><a href="contact.html">Contact</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-3 col-md-6 col-sm-12 wow fadeInRight" data-wow-duration=".3s" data-wow-delay=".4s">
                            <h4 class="footer-head mb-4">Contact Info</h4>
                            <ul class="unstyle-link">
                                <li><strong>Address:</strong>
                                    98 West 21th Street, Suite 721 New York NY 10016
                                </li>
                                <li><strong>Phone:</strong>
                                    (1) 284-676-2886</li>
                                <li><strong>Email:</strong>
                                    info@yourdomain.com</li>
                            </ul>
                        </div>
                        <div class="col-lg-4 col-md-6 col-sm-12 wow fadeInRight" data-wow-duration=".5s" data-wow-delay="1.3s">
                            <h4 class="footer-head mb-4">Newsletter</h4>
                            <p class="mb-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt odio iure animi
                                ullam quam, deleniti rem!</p>
                            <form action="#" class="d-flex">
                                <input type="text" class="form-control me-2" name="email" id="email"
                                    placeholder="Your Email Address" />
                                    <button><i class="fa-solid fa-paper-plane"></i></button>
                            </form>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
export default Footer