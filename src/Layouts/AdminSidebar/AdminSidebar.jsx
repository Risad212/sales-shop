import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './adminsidebar.css';

const AdminSidebar = () => {
    return (
        <div className='adminSidebar'>
            <div className="logo">
                <h3>Dev Store</h3>
            </div>
            <div className='siderMenuList'>
                <div class="nav-item">
                    <Link href="#" className="nav-link">
                        <span className="sidebar-icon"><i class="fa-solid fa-house"></i>
                        </span>
                        <span className="sidebar-text">Home</span>
                    </Link>
                </div>
                <div class="nav-item">
                    <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-cart-shopping"></i></span><span class="sidebar-text">Product</span></span>
                    </Link>
                </div>
                <div class="nav-item">
                    <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-hand-holding-dollar"></i></span><span class="sidebar-text">Transactions</span></span>
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
                    <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-chart-simple"></i></span><span class="sidebar-text">Blog</span></span>
                    </Link>
                </div>
                <div class="nav-item">
                    <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-user"></i></span><span class="sidebar-text">User</span></span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;


