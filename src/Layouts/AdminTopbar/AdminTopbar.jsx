import React from 'react';
import Profile from '../../Media/user.jpg';
import './adminTopbar.css';

const AdminTopbar = () => {
    return (
        <>
            <div className="adminTopbar">
                <div className="topContainer">
                   <div className="topbarLeft">
                      <input type="text" placeholder='Search'/>
                   </div>
                    <div className="topbarRight">
                        <span className='bellIcon'><i class="fa-regular fa-bell"></i></span>
                        <div className="imageWrapper"><img className='adminImage' src={Profile} alt="" /></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminTopbar;