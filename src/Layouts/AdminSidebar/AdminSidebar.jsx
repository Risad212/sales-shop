import React from 'react';
import { Link } from 'react-router-dom';
import './adminsidebar.css';

const AdminSidebar = () => {
    return (
        <div className='adminSidebar'>
            <div className="logo">
                <h3>Dev Store</h3>
            </div>
            <ul>
                <Link to="/admin"><li><i class="fa-solid fa-house"></i> <span className='adminNavItem'>Home</span></li></Link>
                <li className='dropdown'>
                    <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                        <i class="fa-solid fa-cart-shopping"></i> Products
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Link 1</a></li>
                        <li><a class="dropdown-item" href="#">Link 2</a></li>
                        <li><a class="dropdown-item" href="#">Link 3</a></li>
                    </ul>
                </li>
                <Link to="#"><li><i class="fa-solid fa-file-invoice"></i> invoice</li></Link>
                <Link to="#"><li><i class="fa-solid fa-envelope"></i> Email</li></Link>
                <Link to="#"><li><i class="fa-solid fa-blog"></i> Blog</li></Link>
                <Link to="#"><li><i class="fa-solid fa-chart-simple"></i> Chart</li></Link>
                <Link to="#"><li><i class="fa-solid fa-user"></i> User</li></Link>
            </ul>
        </div>
    );
};

export default AdminSidebar;