import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './adminsidebar.css';

const AdminSidebar = () => {
    return (
        <div className='adminSidebar'>
            <div className="sideberInner">
                <div className="logo">
                    <h3>Dev Store</h3>
                </div>
                <div className='siderMenuList px-3'>
                    <div class="accordion nav-item">
                        <Link href="#" className="nav-link">
                            <span className="sidebar-icon"><i class="fa-solid fa-house"></i>
                            </span>
                            <span className="sidebar-text">Home</span>
                        </Link>
                    </div>
                    <div class="accordion" id="accordionExample">
                        <div class="accordion-item nav-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <span class="sidebar-icon"><i class="fa-solid fa-cart-shopping"></i></span>
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    product <span className='angle-icon'><i class="fa-solid fa-angle-up"></i></span>
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <div class="nav-item">
                                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-shop"></i></span><span class="sidebar-text">all product</span></span>
                                        </Link>
                                    </div>
                                    <div class="nav-item">
                                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-cart-plus"></i></span><span class="sidebar-text">Add Product</span></span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-regular fa-credit-card"></i></span><span class="sidebar-text">Order</span></span>
                        </Link>
                    </div>
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-file-invoice"></i></span><span class="sidebar-text">invoice</span></span>
                        </Link>
                    </div>
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-envelope"></i></span><span class="sidebar-text">Email</span></span>
                        </Link>
                    </div>
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-blog"></i></span><span class="sidebar-text">Blog</span></span>
                        </Link>
                    </div>
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-chart-simple"></i></span><span class="sidebar-text">analytics</span></span>
                        </Link>
                    </div>
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-user"></i></span><span class="sidebar-text">User</span></span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;



