import React from 'react';
import Shop from '../components/Shop/Shop'
import Bannercarousel from '../Layouts/BannerCarousel/Bannercarousel';

const Home = () => {
    return (
        <div>
            <Bannercarousel />
            <Shop />
        </div>
    );
};

export default Home;