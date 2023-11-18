import React from 'react';
import './transiction.css';
import { DataGrid } from '@mui/x-data-grid';

const Transiction = () => {
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'username', headerName: 'User Name', width: 200, renderCell: (params) => {
                return (
                    <div className="userListUser">
                        <img className="userListImg" src={params.row.avatar} alt="" />
                        {params.row.username}
                    </div>
                );
            },
        },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: "status", headerName: "Status", width: 120 },
        { field: "transaction", headerName: "Transaction Volume", width: 160 },
    ];
    const rows = [
        {
            id: 1,
            username: 'jhon',
            email: 'jhonDoe@gmail.com',
            status: 'active',
            transaction: '$12,200',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        },
        {
            id: 2,
            username: 'jhon',
            email: 'jhonDoe@gmail.com',
            status: 'active',
            transaction: '$12,200',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        },
        {
            id: 2,
            username: 'jhon',
            email: 'jhonDoe@gmail.com',
            status: 'active',
            transaction: '$12,200',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        },
        {
            id: 4,
            username: 'jhon',
            email: 'jhonDoe@gmail.com',
            status: 'active',
            transaction: '$12,200',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        },
        {
            id: 5,
            username: 'jhon',
            email: 'jhonDoe@gmail.com',
            status: 'active',
            transaction: '$12,200',
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
        },
    ];
    return (
        <div className='transiction commonBgStyle'>
            <h3 className='tranTitle'>Latest Transiction</h3>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </div>
        </div>
    );
};

export default Transiction;