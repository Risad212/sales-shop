import React from 'react';
import './skeletonload.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function ({ type }) {
    if (type == 'product') {
        return (
            <div className="row my-5">
                {
                    Array(8).fill(
                        <div className="col-lg-3 col-md-6 mb-3">
                            <div className="box">
                                <SkeletonTheme baseColor="#ddd" highlightColor="#f5f6f6" height="300px">
                                    <Skeleton />
                                </SkeletonTheme>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    } else if (type === 'blog') {
        return (
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="box">
                        <SkeletonTheme baseColor="#ddd" highlightColor="#f5f6f6" height="300px">
                            <Skeleton count={3} />
                        </SkeletonTheme>
                    </div>
                </div>
            </div>
        )
    }
    else if (type === 'shop') {
        return (
            <div className="row">
                {
                    Array(6).fill(
                        <div className="col-lg-4 col-md-6 mb-3">
                            <div className="box">
                                <SkeletonTheme baseColor="#ddd" highlightColor="#f5f6f6" height="300px">
                                    <Skeleton />
                                </SkeletonTheme>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
    else if (type === 'categorydetails') {
        return (
            <div className="row">
                {
                    Array(8).fill(
                        <div className="col-lg-3 mb-3">
                            <div className="box">
                                <SkeletonTheme baseColor="#ddd" highlightColor="#f5f6f6" height="300px">
                                    <Skeleton />
                                </SkeletonTheme>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
    else if (type === 'blogdetails') {
        return (
            <div className="row">
                <div className="col-lg-12 mb-3">
                    <div className="box">
                        <SkeletonTheme baseColor="#ddd" highlightColor="#f5f6f6" height="300px">
                            <Skeleton />
                        </SkeletonTheme>
                    </div>
                </div>
            </div>
        )
    }
};


