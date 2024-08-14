
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


import { useNavigate, useParams } from 'react-router-dom';
import { Row, Image, Col, Button, ListGroup, Card } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import useAuthContext from '../hooks/useAuthContext';
import useOrdersContext from '../hooks/useOrdersContext';



export default function OrderScreen() {
    const [sdkReady, setSdkReady] = useState(false)
    const { user } = useAuthContext()
    //shippingAddress from cart context 

    const { loading,
        error,
        order,
        successPay,
        loadingPay,
        loadingDeliver,
        successDeliver, getOrderDetails, payOrder, dispatch, deliverOrder } = useOrdersContext()

    const params = useParams();
    const { id: orderId } = params;
    console.log(orderId)
    const navigate = useNavigate()


    useEffect(() => {

        if (!user) {
            navigate('/login')
        }

        const addPaypalScript = async () => {
            const res = await fetch(`/api/config/paypal`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const clientId = await res.json()
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if (!order || successPay || successDeliver || order._id !== orderId) {
            console.log("order is null")
            dispatch({ type: 'PAY_RESET' })
            dispatch({ type: 'DELIVER_RESET' })
            getOrderDetails(orderId)
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPaypalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, orderId, successPay, successDeliver, order])



    const successPaymentHandler = (paymentResult) => {

        payOrder(orderId, paymentResult)
    }




    const deliverHandler = () => {
        deliverOrder(orderId)
    }

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <>

            <h1 className="my-3">Order {orderId}</h1>

            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                {console.log(order)}
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>{' '}
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                {order.shippingAddress.postalCode},{' '}
                                {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <MessageBox variant='success'>
                                    Delivered on {order.deliveredAt}
                                </MessageBox>
                            ) : (
                                <MessageBox variant='danger'>Not Delivered</MessageBox>
                            )}
                        </ListGroup.Item>


                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <MessageBox variant='success'>Paid on {order.paidAt}</MessageBox>
                            ) : (
                                <MessageBox variant='danger'>Not Paid</MessageBox>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? (
                                <MessageBox>Order is empty</MessageBox>
                            ) : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>

                                    {loadingPay && <LoadingBox />}
                                    {!sdkReady ? (
                                        <LoadingBox />
                                    ) : (
                                        <PayPalButtons
                                            //amount={order.totalPrice}
                                            //onSuccess={successPaymentHandler}
                                            //          testing 
                                            createOrder={(data, actions) => {
                                                return actions.order
                                                    .create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    currency_code: "USD",
                                                                    value: order.totalPrice,
                                                                },
                                                            },
                                                        ],
                                                    })
                                                    .then((orderId) => {
                                                        // Your code here after create the order
                                                        return orderId;
                                                    });
                                            }}
                                            onApprove={function (data, actions) {
                                                return actions.order.capture().then(function () {
                                                    // Your code here after capture the order
                                                    successPaymentHandler()
                                                });
                                            }}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <LoadingBox />}
                            {user &&
                                user.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}