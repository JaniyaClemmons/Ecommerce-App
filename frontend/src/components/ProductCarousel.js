import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import useProductsContext from "../hooks/useProductsContext.js";
import LoadingBox from './LoadingBox'
import MessageBox from './MessageBox'

const ProductCarousel = () => {



  const { topProducts, listTopProducts, error } = useProductsContext()

  useEffect(() => {
    listTopProducts()
  }, [])

  return !topProducts ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <Carousel pause='hover' className='bg-dark'>
      {topProducts.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className='carousel-caption'>
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel