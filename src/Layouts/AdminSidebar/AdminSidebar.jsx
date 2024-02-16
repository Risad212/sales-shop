import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './adminsidebar.css';

const AdminSidebar = () => {
    const [toggle, setToggle] = useState(false)
    const [dropdown, setDropdown] = useState({height: '0'})

   const toggleMenu = () => {
      setToggle(!toggle)
      if(toggle){
        setDropdown({height: '0'})
      }else{
        setDropdown({height: 'auto'})
      }
   }
    return (
        <div className='adminSidebar'>
            <div className="logo">
                <h3>Dev Store</h3>
            </div>
            <ul>
                <Link to="/admin"><li><i class="fa-solid fa-house"></i> <span className='adminNavItem'>Home</span></li></Link>
                <li className='dropdown' onClick={() => toggleMenu()}>
                    <i class="fa-solid fa-cart-shopping"></i> Products {toggle? <i class="fa-solid fa-angle-down"></i>: <i class="fa-solid fa-angle-up"></i>}
                    <ul className="dropdownmenu" style={dropdown}>
                        <li><Link className="dropdown-item" href="#">Add product</Link></li>
                        <li><Link className="dropdown-item" href="#">Edit product</Link></li>
                        <li><Link className="dropdown-item" href="#">All product</Link></li>
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