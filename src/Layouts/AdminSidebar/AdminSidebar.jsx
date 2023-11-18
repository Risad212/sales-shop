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
              <Link to="/admin"><li> Home</li></Link>
              <Link to="/admin/product"><li>Products</li></Link>
           </ul>
        </div>
    );
};

export default AdminSidebar;