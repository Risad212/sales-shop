import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ getDataFun, searchFilter, clearSearch }) => {
   const [emptyInput, setEmptyInput] = useState(false)
   const [input,setInput] = useState('') 

   // clear the input
   const emtpyFun = () => {
      setEmptyInput(true)
   }

   // tiger the function when change on input
   const changeInput = (value) => {
      setInput(value);
      setEmptyInput(false)
   }
   return (
      <div className='pFContainer'>
         <input type="text" placeholder='Search' className='w-50' onChange={(e) => [searchFilter(e.target.value),changeInput(e.target.value)]} value={emptyInput? '': input}/>
         <h4 className='category'>Category</h4>
         <ul>
            <li onClick={() => getDataFun(`all`)}>All</li>
            <li onClick={() => getDataFun(`men's clothing`)}>Men</li>
            <li onClick={() => getDataFun(`women's clothing`)}>Women</li>
            <li onClick={() => getDataFun(`jewelery`)}>Jewelery</li>
            <li onClick={() => getDataFun(`electronics`)}>Electronic</li>
         </ul>
         <button className='clearButton' onClick={() => [clearSearch('clear'), emtpyFun()]}>CLEAR FILTERS</button>
      </div>
   );
};

export default ProductFilter;