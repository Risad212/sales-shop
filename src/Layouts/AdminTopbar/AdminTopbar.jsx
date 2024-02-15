import React from 'react';
import Profile from '../../Media/user.jpg';
import './adminTopbar.css';

const AdminTopbar = () => {
    return (
        <>
            <div className="adminTopbar">
                <div className="topContainer">
                    <div className="topbarIcon">
                         <div className="notification">
                             <i class="fa-solid fa-bell"></i>
                             <span>2</span>
                         </div>
                          <div className="language">
                            
                          </div>
                          <div className="setting">
                             
                          </div>
                          
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminTopbar;