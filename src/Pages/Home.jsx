import React from 'react';
import Shop from '../components/Shop/Shop'
import Bannercarousel from '../Layouts/BannerCarousel/Bannercarousel';
import ProductCategory from '../components/productCategory/category';
import CallToAction from '../components/cta/CallToAction';
import ProductFeature from '../components/productFeature/ProductFeature';

const Home = () => {
    return (
        <>
            <Bannercarousel />
             <ProductCategory />
            <Shop />
            <CallToAction />
            <ProductFeature />
        </>
    );
};

export default Home;