import React from 'react';
import Product from '../Product/Product';
import SkeletonLoad from '../SkeletonLoad/SkeletonLoad';


const ShopProduct = ({ allProduct,loadStatus }) => {
    return (
        <>
            {
                allProduct ?
                    allProduct.map((product) => {
                        return (
                            <>
                                <Product item={product} key={product.title} />
                            </>
                        )
                    })
                    :
                    ''
            }
            {
             loadStatus? <SkeletonLoad type="shop"/>: ''
            }
        </>
    );
};

export default ShopProduct;