import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import MessageBox from '../components/MessageBox';

import ListGroup from 'react-bootstrap/ListGroup';

import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import useProfile from '../hooks/useProfile.js'
import useCartContext from '../hooks/useCartContext';
import useAuthContext from '../hooks/useAuthContext';
import useAddress from '../hooks/useAddress';
import useOrdersContext from '../hooks/useOrdersContext';



export default function PlaceOrderScreen() {
    const navigate = useNavigate();
    const { cartItems, paymentMethod, shippingAddress, clearCart } = useCartContext()


    const { createOrder, order, success, error } = useOrdersContext()

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }
    const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0))
    const shippingPrice = addDecimals(itemsPrice < 100 ? 10 : 0)
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)))
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)



    useEffect(() => {
        if (!paymentMethod) {

            navigate('/payment');
        }
        if (success) {
            //look up difference between react navgate and history push 
            navigate(`/order/${order._id}`)
        }

    }, [paymentMethod, navigate, success])

    const placeOrderHandler = async () => {
        await createOrder({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        })
        clearCart()


    }
    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

            <h1 className="my-3">Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            {!shippingAddress ? <LoadingBox /> :
                                <Card.Text>

                                    <strong>Name:</strong> {shippingAddress.fullName} <br />
                                    <strong>Address: </strong> {shippingAddress.address},
                                    {shippingAddress.city}, {shippingAddress.postalCode},
                                    {shippingAddress.country}
                                </Card.Text>}
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {paymentMethod}
                            </Card.Text>
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            {cartItems.length === 0 ? <MessageBox>Your Cart is Empty</MessageBox> :
                                <ListGroup variant="flush">
                                    {cartItems.map((item) => (
                                        <ListGroup.Item key={item.product}>
                                            <Row className="align-items-center">
                                                <Col md={6}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="img-fluid rounded img-thumbnail"
                                                    ></img>{' '}
                                                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={2}>

                                                </Col>
                                                <Col md={4}><span>{item.qty}</span> x ${item.price} = ${item.qty * item.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>}
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>$ {itemsPrice}</Col>

                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${totalPrice}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                    {/*loading && <LoadingBox></LoadingBox>*/}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}