import { createContext, useReducer } from "react"
import ordersReducer from "../reducers/OrdersReducer.js"
import useAuthContext from "../hooks/useAuthContext.js"
import useLogout from "../hooks/useLogout.js"



const OrdersContext = createContext()


//provie context to component tree
export const OrdersContextProvider = ({ children }) => {
    //we get back a state value and function to update it like useState
    //we pass in a custom reducer function and initial state value
    const [state, dispatch] = useReducer(ordersReducer, {
        orders: [], order: null, loading: true, error: '',
        successPay: false,
        loadingPay: false
    })
    const { user } = useAuthContext()
    const { logout } = useLogout()
    //const user = localStorage.getItem('user')

    const createOrder = async (order) => {
        //console.log(order)
        try {

            dispatch({ type: 'ORDER_CREATE_REQUEST' })
            const response = await fetch('/api/orders', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"

                },
                //json string
                body: JSON.stringify(order)

            })

            const createdOrder = await response.json()

            dispatch({ type: 'ORDER_CREATE_SUCCESS', payload: createdOrder })

        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                logout()
            }
            dispatch({ type: 'ORDER_CREATE_FAIL', payload: error })
        }
    }

    const getOrders = async () => {
        try {
            dispatch({ type: 'FETCH_ORDERS_REQUEST' });
            const res = await fetch('/api/orders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const data = await res.json()


            dispatch({ type: 'FETCH_ORDERS_SUCCESS', payload: data });

        }
        catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                logout()
            }
            dispatch({ type: 'FETCH_ORDERS_FAIL', payload: message });
        }

    }

    const getOrderDetails = async (id) => {

        try {
            dispatch({ type: 'FETCH_ORDER_REQUEST' });
            const res = await fetch(`/api/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const data = await res.json();

            dispatch({ type: 'FETCH_ORDER_SUCCESS', payload: data });

        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                logout()
            }
            dispatch({ type: 'FETCH_ORDER_FAIL', payload: message });
        }
    }


    const payOrder = async (orderId, paymentResult) => {
        try {
            dispatch({
                type: 'PAY_REQUEST'
            });
            const response = await fetch(`/api/orders/${orderId}/pay`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"

                },
                //json string
                body: JSON.stringify(paymentResult)

            })
            const data = await response.json()


            dispatch({
                type: 'PAY_SUCCESS',
                payload: data
            })
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                logout()
            }
            dispatch({ type: 'PAY_FAIL', payload: message });
        }
    }



    const deliverOrder = async (orderId) => {

        try {
            dispatch({
                type: "DELIVER_REQUEST",
            })



            const config = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                    body: {}
                },
            }

            const response = await fetch(
                `/api/orders/${orderId}/delivered`,
                config
            )
            const data = response.json()

            dispatch({
                type: "DELIVER_SUCCESS",
                payload: data,
            })
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                dispatch(logout())
            }
            dispatch({
                type: "DELIVER_FAIL",
                payload: message,
            })
        }
    }



    const listMyOrders = async () => {
        try {
            dispatch({
                type: "ORDER_LIST_MY_REQUEST",
            })

            const res = await fetch('/api/orders/myorders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const data = await res.json();


            dispatch({
                type: "ORDER_LIST_MY_SUCCESS",
                payload: data,
            })
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                logout()
            }
            dispatch({ type: 'ORDER_LIST_MY_FAIL', payload: message });
        }
    }





    console.log('OrdersContext state: ', state)
    /*We wrap part of app that needs access to our context 
    (whole app - index.js App) and access them with the children prop */
    return (
        //We not only provide the Orders object but we spread the properties in it
        //so it might as well be Orders, but it would be state.Orders normally
        <OrdersContext.Provider value={{ ...state, dispatch, deliverOrder, getOrders, getOrderDetails, createOrder, payOrder, listMyOrders /*updateOrder, deleteOrder */ }}>
            {children}
        </OrdersContext.Provider>
    )
}

export default OrdersContext
