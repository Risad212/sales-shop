import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './blogSidebar.css';
import { StrogeData } from '../../Context';
import { BlogData } from '../../fakeData/FakeData';

const BlogSidebar = () => {
    const [psPost, setPsPost] = useState([1, 2, 3, 4])
    const {searchPost} = useContext(StrogeData);
    const [postQuery,setPostQuery] = searchPost

    return (
        <div className='blogSidebar'>
            <input type="text" placeholder='Search...'  onChange={(e) => setPostQuery(e.target.value)}/>
            <button type='submit'><i class="fa-solid fa-magnifying-glass"></i></button>
            {/* ---- popular Post -----*/}
            <div className="popularPost mt-5">
                <h3 className='title'>popular post</h3>
                <div className="p-s-post mt-3">
                    {
                        BlogData ? BlogData.map((elem) => {
                            return (
                                <>
                                    <div className="row mb-3">
                                        <div className="col-4 ">
                                            <img src={`${elem?.img}`} className='w-100' alt="" />
                                        </div>
                                        <div className="col-8">
                                            <Link to={'/blog/' + elem?.title}><h5>{elem?.title.substring(0, 12)}</h5></Link>
                                            <Link to="/"><span><i class="fa-regular fa-calendar pe-1"></i>{elem?.date}</span></Link>
                                        </div>
                                    </div>
                                    <hr />
                                </>
                            )
                        })
                        :
                        'popular post not found'
                    }
                </div>
            </div>
            {/* ---- All Categories -----*/}
             <div className="mt-5">
                <h3 className='title'>CATEGORIES</h3>
                 <ul className='category-list'>
                    <li><Link to='/'>✜ Men</Link></li>
                    <li><Link to='/'>✜ Women</Link></li>
                    <li><Link to='/'>✜ jewellery</Link></li>
                    <li><Link to='/'>✜ electronics</Link></li>
                 </ul>
             </div>
        </div>
    );
};

export default BlogSidebar;