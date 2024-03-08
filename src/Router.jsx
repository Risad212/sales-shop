import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import HomePageLayouts from './Layouts/HomePageLayouts/HomePageLayouts';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import ProductDetails from './components/productDetails/ProductDetails';
import Cart from './Pages/Cart';
import Wishlist from './Pages/Wishlist';
import Contact from './Pages/Contact'
/*---------------------------------------*/
// import NotFound from '../NotFound/NotFound';
import DashboardLayout from './Layouts/DashboardLayout/DashboardLayout'
import Admin from './Pages/Admin';
import Products from './Pages/Products';
import AddProduct from './Pages/AddProduct';
import EditProductPage from './Pages/EditProductPage';
import ProductCollection from './components/ProductFilterCategory/ProductCollection';


// ----------------------------------------------------------------------

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePageLayouts />}
        >
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/category/:name' element={<ProductCollection />}/>
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
        <Route
          path="/admin"
          element={<DashboardLayout />}
        >
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path='/admin/addproduct' element={<AddProduct />} />
          <Route path='/admin/product/:id' element={<EditProductPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

