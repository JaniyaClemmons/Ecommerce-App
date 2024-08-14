
import React, { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Row, Col, Image, ListGroup, Card, Button, Form } from "react-bootstrap"
import useCartContext from "../hooks/useCartContext.js"
import Message from "../components/MessageBox.js"


const CartScreen = () => {
    const history = useNavigate()



    const { cartItems, updateCartQty, removeFromCart, dispatch } = useCartContext()

    /* For URL query/params 
    const { id } = useParams()
    const location = useLocation()
    //returns a string or null so wrap in Number 
    const qty = Number(new URLSearchParams(location.search).get('qty')) */

    /*useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')).cartItems;
        if (items) {
            dispatch({ type: 'SET_CART_ITEMS', payload: items });
        }
    }, [dispatch])*/


    const removeHandler = (id) => {
        removeFromCart(id)

    }
    const checkoutHandler = (event) => {
        event.preventDefault()
        console.log("checkout")

        //go login unless redirect string to shipping
        history('/login?redirect=/shipping')
    }



    return (
        <div>
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>
            <Row>
                <Col md={8}>
                    <h1>Shopping Cart</h1>
                    {/*If cart is empty from cart button, youll have a message pop up */}
                    {cartItems.length === 0 ? <Message>Your cart is empty <Link to='/'> Go Back </Link> </Message> :
                        (<ListGroup variant="flush">
                            {cartItems.map(item => (
                                <ListGroup.Item key={item.product}>
                                    <Row>
                                        <Col md={2}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col md={3}>
                                            <Link to={`/products/${item.product}`}> {item.name} </Link>
                                        </Col>
                                        <Col md={2}>
                                            ${item.price}
                                        </Col>
                                        <Col md={2}>
                                            <Form.Control as="select" value={item.qty} onChange={(e) => {
                                                updateCartQty(item.product, Number(e.target.value))
                                            }}>
                                                {/* takes count in stock as length of an array and keys + ... fills array with 1,2,3..*/}
                                                {[...Array(item.countInStock).keys()].map(x => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                        <Col md={2}>
                                            <Button type="button" variant="light" onClick={() => removeHandler(item.product)}>
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </Col>

                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>)}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h2>
                                        Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                                        items) : $
                                        {(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2)}
                                    </h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </div>
    )
}

export default CartScreen;
