import React from 'react';
import './productfeature.css';

function ProductFeature() {
    return (
        <>
            <section className="productfeature">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="pf-card">
                                <span className='iconwrapper'><i class="fa-solid fa-earth-asia"></i></span>
                                <h3 className='pf-title'>Worldwide Shipping</h3>
                                <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="pf-card">
                                <span className='iconwrapper'><i class="fa-solid fa-shirt"></i></span>
                                <h3 className='pf-title'>Best Quality</h3>
                                <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="pf-card">
                                <span className='iconwrapper'><i class="fa-solid fa-gift"></i></span>
                                <h3 className='pf-title'>Best Offers</h3>
                                <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="pf-card">
                                <span className='iconwrapper'><i class="fa-solid fa-lock"></i></span>
                                <h3 className='pf-title'>Secure Payments</h3>
                                <p>It elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ProductFeature;