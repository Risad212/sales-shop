import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SkeletonLoad from '../SkeletonLoad/SkeletonLoad';

function ProductCollection() {
    const [collection, setCollection] = useState()
    const [isLoading,setIsLoading] = useState(false)
    const { name } = useParams()
    useEffect(() => {
        const getCollection = async () => {
           setIsLoading(true)
           try{
             const response = await axios.get(`https://fakestoreapi.com/products/category/${name}`);
             setCollection(response)
             setIsLoading(false)
           }
           catch{
             setIsLoading(false)
           }
        }
        getCollection()
       },[])
    return (
        <section className='product-collection py-5'>
            <div className="container">
                <h2 className='pb-5 text-center fw-bold' style={{ fontSize: '40px' }}>jewelery Collection</h2>
                <div className="row">
                    {
                        collection && collection.data.map((singleColl) => {
                            return (
                                <>
                                    <div className="col-lg-3 col-md-6 col-sm-12" key={singleColl?.id}>
                                        <div class="card h-100 text-center p-4">
                                            <Link to={'/product/' + singleColl?.id}>
                                                <img src={singleColl?.image} class="card-img-top" alt={singleColl?.title} height="200px" />
                                            </Link>
                                            <div class="card-body">
                                                <h5 class="card-title fw-bold">{singleColl?.title.substring(0, 12)}</h5>
                                                <p class="card-text lead fw-bold">${singleColl?.price}</p>
                                                <button class="btn btn-outline-dark px-4" onClick={() => addToCart()}>Add To Cart</button>
                                                <button class="btn btn-outline-dark px-2 border-start-0" onClick={() => setWishProduct()}>
                                                    <i class={`fa-regular fa-heart`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })
                    }
                    {
                        isLoading ? <SkeletonLoad type="productCollection" /> : ''
                    }
                </div>
            </div>
        </section>
    );
}

export default ProductCollection;