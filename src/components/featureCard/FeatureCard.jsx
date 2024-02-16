import React from 'react';
import './featurecard.css';

function FeatureCard() {
    return (
        <div className='feature-area'>
            <div className="row">
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="card-title">product</h4></div>
                                <div className="icon-shape">
                                    <i class="fa-solid fa-bag-shopping"></i>
                                </div>
                            </div>
                            <div>
                                <h2 className="card-number">200</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="card-title">Revenue</h4></div>
                                <div className="icon-shape">
                                    <i class="fa-solid fa-cloud-arrow-down"></i>
                                </div>
                            </div>
                            <div>
                                <h2 className="card-number">35,235</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="card-title">Orders</h4></div>
                                <div className="icon-shape">
                                <i class="fa-solid fa-tag"></i>
                                </div>
                            </div>
                            <div>
                                <h2 className="card-number">1,235</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h4 className="card-title">User</h4></div>
                                <div className="icon-shape">
                                  <i class="fa-solid fa-user"></i>
                                </div>
                            </div>
                            <div>
                                <h2 className="card-number">10,236</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureCard;