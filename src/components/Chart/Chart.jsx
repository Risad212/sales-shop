import React from 'react';
import './chart.css';
import { Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart} from 'recharts';
import {UserData} from '../../dummyData/dummyData';

const Chart = ({dataKey,title}) => {
    return (
        <>
            <div className='chart commonBgStyle'>
                <h3 className='chartTitle'>{title}</h3>
                <ResponsiveContainer width="100%" aspect={4 / 1}>
                    <LineChart data={UserData}>
                      <XAxis dataKey="name" stroke='#2a3042'/>
                      <Line type="monotone" dataKey={dataKey} stroke='#2a3042'/>
                      <Tooltip />
                      <CartesianGrid stroke='#ddd' strokeDasharray="5 5"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default Chart;