import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BlogSidebar from '../BlogSIdebar/BlogSidebar';
import SkeletonLoad from '../SkeletonLoad/SkeletonLoad';
import './blogdetails.css';

const BlogDetails = () => {
    const [targetBlog, setTargetBlog] = useState()
    const { title } = useParams()
    const [isLoading,setIsLoading] = useState(false);

    useEffect(() => {
        const getBlog = async () => {
            setIsLoading(true)
            const response = await axios.get(`https://newsapi.org/v2/everything?q=apple&from=2023-03-09&to=2023-03-09&sortBy=popularity&apiKey=${import.meta.env.VITE_API_KEY}`)
            if (response) {
                let blogs = response.data;
                let filterBlog = blogs?.articles.filter((blog) => {
                    return blog.title == title
                })

                setTargetBlog(filterBlog)
                setIsLoading(false)
            }else{
                setIsLoading(false)
            }
        }
        getBlog()
    }, [title])

    return (
        <>
            <div className="blogDetails-container">
                <div className="container">
                    <div className="row py-5">
                        <div className="col-lg-8 col-md-8 col-sm-12">
                            <div className="blogDetails">
                                {
                                    targetBlog ? targetBlog.map((elem) => {
                                        const { author, content, title, url, publishedAt, source, urlToImage } = elem
                                        return (
                                            <>
                                                <img src={`${urlToImage}`} class="img-fluid" alt="" />
                                                <div className="info mt-3">
                                                    <Link to='/'><span className='date'><i class="fa-regular fa-calendar-check pe-1"></i>{publishedAt}</span></Link>
                                                    <Link to='/'><h3 className='title'>{title}</h3></Link>
                                                    <div className="auth-info">
                                                        <span>Post: {source?.name}</span>
                                                        <span>Author: {author}</span>
                                                    </div>
                                                    <p className='disc'>{content}</p>
                                                    <a href={`${url}`} className='redmore-btn'>Read More</a>
                                                </div>
                                            </>
                                        )
                                    })
                                     :
                                     isLoading? <SkeletonLoad type="blogdetails"/>: ''
                                }
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-12">
                           <BlogSidebar />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetails;


