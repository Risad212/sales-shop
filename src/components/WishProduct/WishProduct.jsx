import React, { useContext } from 'react';
import './wishproduct.css';
import { StrogeData } from '../../Context';


const wishProduct = () => {
    const { wishCart,product } = useContext(StrogeData)
    const [wishItem, setWishItem] = wishCart
    const [cartCount, setCartCount] = product

    // add product in cart
    const addToCart = (elem) => {
        if(cartCount){
          let filterData = cartCount.filter((item) => {
              return elem.id  !== item.id
           })
           setCartCount([...filterData,elem])
        }else{
          setCartCount([...elem])
        }
   }

    // remove Item From WishList
    const removeItem = (id) => {
        const filterItem = wishItem.filter((elem) => {
             return elem.id !== id;
        })
        setWishItem(filterItem)
      }
    return (
        <>
            <div className="wishContainer">
                <h2 className="title">My wishlist on Shopping Cart</h2>
                <div className='tableDiv'>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Image</th>
                            <th>Unit Price</th>
                            <th>Stock Status</th>
                            <th>Add to Cart</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            wishItem ? wishItem.map((elem) => {
                                return (
                                    <>
                                        <tr>
                                            <td>{elem?.title.substring(0, 12)}</td>
                                            <td><img src={elem?.image} alt="" /></td>
                                            <td>${elem?.price}</td>
                                            <td>in a stock</td>
                                            <td><span onClick={() => addToCart(elem)}>add to cart</span></td>
                                            <td><i class="fa-solid fa-trash-can" onClick={() => removeItem(elem?.id)}></i></td>
                                        </tr>
                                    </>
                                )
                            })
                            :
                            'WishItem Not Found'
                        }
                    </tbody>
                </table>
                </div>
            </div>
        </>
    );
};

export default wishProduct;