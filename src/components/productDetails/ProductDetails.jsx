import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';
import Rating from '../rating/Rating';
import { StrogeData } from '../../Context';
import axios from 'axios';
import SkeletonLoad from '../SkeletonLoad/SkeletonLoad';

const ProductDetails = () => {
    const { product } = useContext(StrogeData);
    const [cartCount, setCartCount] = product
    const { id } = useParams()
    const [item, setItem] = useState({})
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getProduct = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`https://fakestoreapi.com/products/${id}`)
                setItem(response?.data)
                setIsLoading(false)
            }
            catch {
                setIsLoading(false)
            }
        }
        getProduct()
    }, [id])

    const addToCart = () => {
        if (cartCount) {
            let filterData = cartCount.filter((elem) => {
                return elem.id !== item?.id
            })
            setCartCount([...filterData, item])
        } else {
            setCartCount([...cartCount])
        }
    }
    return (
        <div className='producDetails'>
            <div className="container my-5">
                <div className="row mt-5">
                    <div className='col-lg-4 col-md-6 col-sm-12'>
                        <img src={item?.image} alt=""/>
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-12">
                        <div className='productInfo'>
                            <h3>{item?.title}</h3>
                            <p>{item?.description}</p>
                            <span>${item?.price}</span>
                            <Rating star={item?.rating?.rate} />
                            <p className='mt-2 mb-2'>{item?.rating?.count} Customer Reviews</p>
                            <p>Category: {item?.category}</p>
                            <button className='btn btn-outline-dark mt-4 d-block' onClick={() => addToCart()}>Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;