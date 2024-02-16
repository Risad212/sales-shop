import React from 'react';
import './category.css';
import { Link } from 'react-router-dom';
import { categoryData } from '../../fakeData/FakeData';

function category() {

    console.log(categoryData);
    return (
        <>
            <section className='product-category'>
                <div className="container">
                    <h2>Product Category</h2>
                    <div className="border"></div>
                    <div className="row">
                        {
                            categoryData.map((category) => {
                                return (
                                    <>
                                        <div className="col-lg-3">
                                            <img className='img-fluid' src={category?.img} alt="" />
                                            <h4 className='category-title'>{category?.title}</h4>
                                            <Link className='category-button' to="#">see collection</Link>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export default category;