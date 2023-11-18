import React, { createContext, useState } from 'react';
import Router from './Router';

export const StrogeData = createContext()

const Context = () => {
    const [cartCount, setCartCount] = useState([])
    const [wishItem, setWishItem] = useState([])
    const [postQuery,setPostQuery] = useState()
    return (
        <StrogeData.Provider value={{product: [cartCount,setCartCount], wishCart: [wishItem, setWishItem], searchPost:[postQuery,setPostQuery]}}>
           <Router />
        </StrogeData.Provider>
    );
};

export default Context;