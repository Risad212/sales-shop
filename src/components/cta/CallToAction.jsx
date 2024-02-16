import React from 'react';
import './calltoaction.css';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <>
            <section className='callToAction'>
                <div className="container">
                    <div className="content-wrapper">
                        <h3 className='cta-title'>Our best content every month
                            In your mailbox</h3>
                        <Link className='cta-btn' to="#">Call To Action</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CallToAction;