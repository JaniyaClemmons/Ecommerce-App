import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Table, Form } from "react-bootstrap"
import { LinkContainer } from 'react-router-bootstrap'
import useProfile from '../hooks/useProfile.js'
import { useNavigate } from 'react-router-dom';
import useOrdersContext from '../hooks/useOrdersContext.js'
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';

export default function ProfileScreen() {
    const navigate = useNavigate();
    const { getProfile, updateProfile, user, error, isLoading, success } = useProfile()
    const { loading: loadingOrders, orders, error: errorOrders, listMyOrders, getOrderDetails } = useOrdersContext()
    const [updatedUser, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })


    useEffect(() => {

        listMyOrders()


        if (success) {
            getProfile()

        }
        if (user) {
            setUser((prevValue) => {
                return ({ ...prevValue, "name": user.name, "email": user.email })
            })
        }


    }, [])

    function handleChange(event) {

        const { name, value } = event.target;
        setUser(prevValue => {
            return ({ ...prevValue, [name]: value })
        });
    }
    const handleDetailsClick = (event) => {
        console.log(event.target.value)
        getOrderDetails(event.target.value)
        navigate(`/order/${event.target.value}`)

    }


    const submitHandler = async (e) => {

        e.preventDefault()


        updateProfile(updatedUser.name, updatedUser.email, updatedUser.password)

        setUser(prevValue => {
            return ({ ...prevValue, password: "" })
        })


    }

    return (
        <div className="container small-container">
            <Row>
                <Col md={3}>
                    <h1 className="my-3">User Profile</h1>
                    {error && <MessageBox variant='danger'>{error}</MessageBox>}

                    {success && <MessageBox variant='success'>Profile Updated</MessageBox>}
                    {isLoading ? (
                        <LoadingBox />
                    ) : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={updatedUser.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    value={updatedUser.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    value={updatedUser.password}
                                />
                            </Form.Group>
                            {/*<Form.Group className="mb-3" controlId="password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>*/}
                            <div className="mb-3">
                                <Button type="submit" disabled={isLoading}>Update</Button>
                            </div>

                        </Form>)}
                </Col>
                <Col md={9}>
                    <h2>My Orders</h2>
                    {loadingOrders ? (
                        <LoadingBox />
                    ) : errorOrders ? (
                        <MessageBox variant='danger'>{errorOrders}</MessageBox>
                    ) : (
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>DELIVERED</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>
                                            {order.isPaid ? (
                                                order.paidAt.substring(0, 10)
                                            ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>
                                        <td>
                                            {order.isDelivered ? (
                                                order.deliveredAt.substring(0, 10)
                                            ) : (
                                                <i className='fas fa-times' style={{ color: 'red' }}></i>
                                            )}
                                        </td>
                                        <td>

                                            <Button onClick={handleDetailsClick} value={order._id} className='btn-sm' variant='light'>
                                                Details
                                            </Button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>



        </div>
    );
}

