import React, { useEffect, useState } from 'react';
import './addnewproduct.css'
import { useForm } from "react-hook-form";


const AddNewProduct = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [allCategory, setAllCategory] = useState([])

    useEffect(() => {
        fetch('https://fakestoreapi.com/products/categories')
            .then(res => res.json())
            .then(json => setAllCategory(json))
    }, [])

    const onSubmit = data => {
        const file = data.image[0];
        const formData = new FormData()
        const image = formData.append('image', file)
        let newData
        console.log('client side working');
        // try{
        //     newData = {...data,formData}
        //     axios.post('http://localhost:5000/api/product/addProduct', {
        //         product: newData,
        //       })
        //       .then(function (response) {
        //         console.log(response);
        //       })
        //       .catch(function (error) {
        //         console.log(error);
        //       });
        // }catch(error){
        //     console.log(error);
        // }
        // reset()
    }
    return (
         <>
           <div className='addnewprduct commonBgStyle'>
            <h3 className='title'>Add new Product</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='addNewProductContainer'>
                    <div>
                        <div>
                            <label for="fname">Product Name</label>
                            <input type="text" {...register("title", { required: true })} name="title" placeholder='Product name'/>
                        </div>
                        <div>
                            <label for="fname">Select Category</label>
                            <select name="category" id="category" {...register("category", { required: true })}>
                                <option value="" selected>Category</option>
                                {
                                    allCategory ? allCategory.map((elem) => {
                                        return (
                                            <option key={elem}>{elem}</option>
                                        )
                                    })
                                        :
                                        'Category not Found'
                                }
                            </select>
                        </div>
                        <div>
                            <label for="price">Price</label>
                            <input type="number" {...register("price", { required: true }, { min: 20, max: 100000 })} name="price" placeholder='Price' />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label for="image">Upload Image</label>
                            <div className="fileInput">
                                
                                <h3>Drop files here or click to upload.</h3>
                                <input type="file" id="image" name="image" {...register("image", { required: true })} />
                            </div>
                        </div>
                        <div className='mt-5'>
                            <label for="image">Discription</label>
                            <textarea name="description" cols="30" rows="4" {...register("description", { required: true })}></textarea>
                        </div>
                    </div>
                    {errors.exampleRequired && <span>This field is required</span>}
                    <input type="submit" id="submitBtn" />
                </div>
            </form>
        </div>
         </>
    );
};

export default AddNewProduct;