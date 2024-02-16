import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminTopbar from '../AdminTopbar/AdminTopbar';
import './dashboardlayout.css';


const DashboardLayout = () => {
    return (
        <>
            <div className="dashbaord-main">
                <div className="Sidebar">
                    <AdminSidebar />
                </div>
                <div className="dashboard-content">
                    <AdminTopbar />
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;