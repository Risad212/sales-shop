import React from 'react';
import './pagination.css';

const Pagination = ({ postPerPage, totalPost,paginate }) => {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
        pageNumbers.push(i)
    }
    return (
        <div className='paginationContainer mb-3'>
            <nav aria-label="Page navigation example">
                <ul class="pagination text-center">
                    {
                        pageNumbers?.map((number) => {
                           return (
                              <li class="page-item me-2" key={number} onClick={() => paginate(number)}>
                                <span class="page-link">{number}</span>
                             </li>
                           )
                        })
                      }
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;