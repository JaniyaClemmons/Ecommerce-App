const ordersReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_ORDERS_REQUEST':
            return {
                ...state,
                loading: true,
                error: ''

            }
        case 'FETCH_ORDERS_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: ''
            }
        case 'FETCH_ORDERS_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case 'ORDER_LIST_MY_REQUEST':
            return {
                ...state,
                loading: true,
                error: ''

            }
        case 'ORDER_LIST_MY_SUCCESS':
            return {
                ...state,
                loading: false,
                orders: action.payload,
                error: ''
            }
        case ' ORDER_LIST_MY_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,

            }
        case 'ORDER_LIST_MY_RESET':
            return { ...state, orders: [] };

        case 'FETCH_ORDER_REQUEST':
            return {
                ...state,
                loading: true,
                error: ''

            }
        case 'FETCH_ORDER_SUCCESS':
            return {
                ...state,
                loading: false,
                order: action.payload,
                error: ''
            }
        case 'FETCH_ORDER_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case 'ORDER_CREATE_REQUEST':
            return {
                ...state,
                loading: true,
                error: ''
            }


        case "ORDER_CREATE_SUCCESS":
            return {
                /*payload would be a single ORDER, so ORDERs is array 
                of prev ORDERs with new one at the front */
                ...state,
                loading: false,
                error: '',
                success: true,
                orders: [action.payload, ...state.orders],
                order: action.payload
            }

        case 'ORDER_CREATE_FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false,
                order: null
            }
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true, error: '' };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true, error: '' };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false, error: action.payload };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false, error: '' };

        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true, error: '' };
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true, error: '' };
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false, error: action.payload };
        case 'DELIVER_RESET':
            return {
                ...state,
                loadingDeliver: false,
                successDeliver: false,
                error: ''
            }

        case "DELETE_ORDER":
            return {
                ...state,
                //array without the deleted ORDER 
                orders: state.orders.filter((order) =>
                    //adds everything true to array 
                    (order._id !== (action.payload)._id)
                )
            }

        default:
            return state;

    }

}
export default ordersReducer