import React, { useState, useEffect } from "react"
import LoadingBox from '../components/LoadingBox';
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import { Link, useParams, useNavigate } from "react-router-dom"
import Rating from "../components/Rating.js"
import useProductsContext from "../hooks/useProductsContext.js"
import useCartContext from "../hooks/useCartContext.js"
import useAuthContext from "../hooks/useAuthContext.js"
import MessageBox from "../components/MessageBox.js";
import Meta from "../components/Meta.js"
/*import products from "../products"*/



//We access to :id param through props.match.id
const ProductScreen = () => {
    const history = useNavigate()
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')


    //To get the params from the url
    const { id } = useParams()
    const { user } = useAuthContext()
    const { product, listProductDetails, error, createProductReview, successProductReview, loadingProductReview, errorProductReview, dispatch } = useProductsContext()
    const { addToCart } = useCartContext()



    useEffect(() => {
        console.log("here")
        listProductDetails(id)
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: "PRODUCT_CREATE_REVIEW_RESET" })
        }
    }, [])

    const addToCartHandler = () => {
        //call add to cart here and then go to just /cart   
        addToCart(id, qty)
        history(`/cart`)
        //history(`/cart/${id}?qty=${qty}`)

    }
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(
            createProductReview(id, {
                rating,
                comment,
            })
        )
        //listProductDetails(id)
        setRating(0)
        setComment('')
        history(`/products/${id}`)

    }

    return (
        <>
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>

            {!product ? (<LoadingBox />) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <>
                    <Meta title={product.name} />
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating
                                        value={product.rating}
                                        text={`${product.numReviews} reviews`} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: {product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Price:
                                            </Col>
                                            <Col>
                                                <strong>${product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                Status:
                                            </Col>
                                            <Col>
                                                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col> Qty </Col>
                                                <Col>
                                                    <Form.Control as="select" value={qty} onChange={(e) =>
                                                        setQty(e.target.value)}>

                                                        {[...Array(product.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                    )}


                                    <ListGroup.Item>

                                        <Button
                                            onClick={addToCartHandler}
                                            className="btn-block w-100"
                                            type="button"
                                            disabled={product.countInStock === 0}>
                                            Add to Cart
                                        </Button>

                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>

                    </Row>
                    <Row>
                        <Col md={6}>

                            <h2>Reviews</h2>
                            {product.reviews.length === 0 && <MessageBox>No Reviews</MessageBox>}
                            <ListGroup variant='flush'>
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} />
                                        <p>{review.createdAt.substring(0, 10)}</p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {successProductReview && (
                                        <MessageBox variant='success'>
                                            Review submitted successfully
                                        </MessageBox>
                                    )}
                                    {loadingProductReview && <LoadingBox />}
                                    {errorProductReview && (
                                        <MessageBox variant='danger'>{errorProductReview}</MessageBox>
                                    )}
                                    {user ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value=''>Select...</option>
                                                    <option value='1'>1 - Poor</option>
                                                    <option value='2'>2 - Fair</option>
                                                    <option value='3'>3 - Good</option>
                                                    <option value='4'>4 - Very Good</option>
                                                    <option value='5'>5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button
                                                disabled={loadingProductReview}
                                                type='submit'
                                                variant='primary'
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <MessageBox>
                                            Please <Link to='/login'>sign in</Link> to write a review{' '}
                                        </MessageBox>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>

                </>
            )}


        </>)
}


export default ProductScreen
