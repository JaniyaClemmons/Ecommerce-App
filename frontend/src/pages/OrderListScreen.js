import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'
import useOrderContext from '../hooks/useOrdersContext.js'
import useAuthContext from "../hooks/useAuthContext.js"

const OrderListScreen = () => {



    const { getOrders, getOrderDetails, loading, error, orders } = useOrderContext()

    const { user } = useAuthContext()
    const history = useNavigate()

    useEffect(() => {
        if (user && user.isAdmin) {
            getOrders()
        } else {
            history('/login')
        }
    }, [history, user])

    const handleDetailClick = (event) => {
        const orderId = event.target.name
        getOrderDetails(orderId)
        history(`/order/${orderId}`)
    }

    return (
        <>
            <h1>Orders</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
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
                                <td>{order.user && order.user.name}</td>
                                <td>{order.createdAt.substring(0, 10)}</td>
                                <td>${order.totalPrice}</td>
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

                                    <Button onClick={handleDetailClick} name={order._id} variant='light' className='btn-sm'>
                                        Details
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default OrderListScreen