import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminTopbar from '../AdminTopbar/AdminTopbar';
import './dashboardlayout.css';


const DashboardLayout = () => {
    return (
        <>
            <div className="row">
                <div className="col-lg-2">
                    <AdminSidebar />
                </div>
                <div className="col-lg-10">
                    <AdminTopbar />
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;