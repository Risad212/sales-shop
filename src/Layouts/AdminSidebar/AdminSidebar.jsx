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
                    <div class="nav-item">
                        <Link href="#" class="nav-link"><span><span class="sidebar-icon"><i class="fa-solid fa-hand-holding-dollar"></i></span><span class="sidebar-text">Transactions</span></span>
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



<div class="accordion nav-item">
    <div class="accordion-item">
        <a aria-expanded="false" href="#" class="d-flex justify-content-between align-items-center accordion-button collapsed nav-link" role="button"><span><span class="sidebar-icon"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" class="svg-inline--fa fa-table fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z"></path></svg> </span><span class="sidebar-text">Tables</span></span></a>
        <div class="accordion-collapse collapse" style=""><div class="multi-level accordion-body"><div class="flex-column nav"><div class="nav-item">
            <a href="#/tables/bootstrap-tables" class="nav-link"><span><span class="sidebar-text">Bootstrap Table</span></span></a></div></div></div></div></div></div>