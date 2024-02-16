import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Product from '../Product/Product';
import SkeletonLoad from '../SkeletonLoad/SkeletonLoad';
import './shop.css';


const Products = () => {
  const [item, setItem] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  const [filter, setFilter] = useState(item)
  
  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true)
      try{
        const response = await axios.get('https://fakestoreapi.com/products')
        setItem(response.data)
        setFilter(response.data)
        setIsLoading(false)
      }
      catch{
        setIsLoading(false)
      }
    }
    getProduct()
  }, [])
  return (
    <div className='shop'>
      <div className='container'>
        <h2>Featured Products</h2>
         <div className="border"></div>
        <div className="row">
          {
            item ?
             item.map((product) => {
                return (
                  <>
                    <Product item={product} key={product.id}/>
                  </>
                )
              })
              :
              'Product Not Found'
            }
            {
              isLoading? <SkeletonLoad type="product"/>: ''
            }
        </div>
      </div>
    </div>
  );
};

export default Products;