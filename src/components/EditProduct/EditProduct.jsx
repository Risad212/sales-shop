import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './editproduct.css';


const EditProduct = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [allCategory, setAllCategory] = useState([])

    const [handleInput,setHandleInput] = useState({
         title: 'camera',
         category: 'jewelery',
         discription: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit expedita nisi ipsa maiores dolorum assumenda aperiam quae excepturi,`,
         price: '123',
         image: 'https://images.pexels.com/photos/7956663/pexels-photo-7956663.jpeg?auto=compress&cs=tinysrgb&w=1600',
    })

    useEffect(() => {
        fetch('https://fakestoreapi.com/products/categories')
            .then(res => res.json())
            .then(json => {
                let filter = json.filter((elem) => {
                     return elem !== handleInput.category
                })
                setAllCategory(filter)
            })
    }, [])
    

    // submit data
    const onSubmit = data => {
        console.log(data);
        reset()
    }
    return (
        <div className='editProduct commonBgStyle'>
            <h3 className='title'>Edit Product</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='addProductinput'>
                    <div>
                        <div>
                            <label for="fname">Product Name</label>
                            <input type="text" {...register("title", { required: true })} name="title" placeholder='Camera'/>
                        </div>
                        <div>
                            <label for="fname">Select Category</label>
                            <select name="category" id="category" {...register("category", { required: true })}>
                                <option selected>{handleInput.category}</option>
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
                            <input type="number" {...register("price", { required: true }, { min: 20, max: 100000 })} name="price" placeholder='Price'/>
                        </div>
                        <div className='mt-5'>
                            <label for="image">Discription</label>
                            <textarea name="description" id="" cols="50" rows="5" {...register("description", { required: true })}></textarea>
                        </div>
                    </div>
                    {/*----- row ----*/}
                    <div>
                        <div className='secondRow'>
                            <img src={`${handleInput.image}`}alt=""/>
                        </div>
                        <label for="image">Change Image</label>
                        <div className="fileInput">
                           
                            <h3>Drop files here or click to upload.</h3>
                            <input type="file" id="image" name="image" {...register("image", { required: true })}/>
                        </div>
                    </div>
                </div>
                {errors.exampleRequired && <span>This field is required</span>}
                <input type="submit" id="submitBtn" />
            </form>
        </div>
    );
};

export default EditProduct;
