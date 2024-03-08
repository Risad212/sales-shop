import React from 'react';
import './calltoaction.css';
import { Link } from 'react-router-dom';

const CallToAction = () => {
    return (
        <>
            <section className='callToAction'>
                <div className="container">
                    <div className="content-wrapper">
                        <h3 className='cta-title'>SALE UP TO 70% OFF FOR ALL FASHION ITEMS, ON ALL BRANDS.</h3>
                        <Link className='cta-btn' to="/contact">Call To Action</Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CallToAction;