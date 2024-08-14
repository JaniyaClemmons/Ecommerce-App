
import React, { useState, useEffect } from "react"
import Product from "../components/Product.js"
import useProductsContext from "../hooks/useProductsContext.js";
import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'
import Paginate from '../components/Paginate.js'
import { useLocation, useParams, Link } from "react-router-dom"
//import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta.js'
import ProductCarousel from "../components/ProductCarousel.js"


import { Row, Col } from "react-bootstrap"

const Home = () => {

    const { products, loading, listProducts, error, page, pages } = useProductsContext()

    /*Get the query params with URLSearchParams and other params ":pageNumber" with useParams*/
    const { search } = useLocation()
    const params = useParams();
    const keyword = new URLSearchParams(search).get('keyword') || params.keyword
    const { pageNumber: pn } = params;
    const pageNumber = pn ? pn : 1

    //fires on load - we cant make useEffect async so we create a function and call it
    useEffect(() => {
        listProducts(keyword, pageNumber)
    }, [keyword, pageNumber])

    return (
        <>
            <Meta />
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Link to='/' className='btn btn-light'>
                    Go Back
                </Link>
            )}
            <h1>
                Latest Products
            </h1>
            <Row>

                {loading ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant='danger'>{error}</MessageBox>
                ) : (
                    products.map(product => {
                        return (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3} >
                                <Product product={product} />
                            </Col>
                        )

                    })
                )}
            </Row>
            <Paginate
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ''}
            />

        </>
    )
}

export default Home;
