const cartReducer = (state, action) => {

    switch (action.type) {

        case 'SAVE_PAYMENTMETHOD':
            const newCart = {
                ...state,
                paymentMethod: action.payload
            }

            localStorage.setItem('paymentMethod', JSON.stringify(action.payload))
            return newCart
        
        case 'SET_CART_ITEMS':

            return {
                ...state,
                cartItems: action.payload
            }

        case 'ADD_ITEM_TO_CART': {
            const { product, qty } = action.payload
            const cartItem = state.cartItems.find(item => item.product === product)
            if (cartItem) {
                const newCart = { ...state, cartItems: state.cartItems.map(item => item.product === product ? { ...item, qty: item.qty + qty } : item) }
                return newCart
            } else {
                const newCart = {
                    ...state,
                    cartItems: [...state.cartItems,
                    action.payload]
                }
                return newCart

            }

        }
        case 'ADD_ITEM_TO_LOCAL_CART': {
            const { product, qty } = action.payload
            const cartItem = state.cartItems.find(item => item.product === product)
            if (cartItem) {
                const newCart = { ...state, cartItems: state.cartItems.map(item => item.product === product ? { ...item, qty: item.qty + qty } : item) }
                localStorage.setItem('cart', JSON.stringify(newCart))
                return newCart
            } else {

                const newCart = {
                    ...state,
                    cartItems: [...state.cartItems,
                    action.payload]
                }
                //stringify to store as string and parse to take out as json 
                localStorage.setItem('cart', JSON.stringify(newCart))
                return newCart

            }
        }
        case 'UPDATE_LOCAL_CART_ITEM': {
            const { product, qty } = action.payload

            console.log(`Product is ${product} and qty is ${qty}`)

            const newCart = { ...state, cartItems: state.cartItems.map(item => item.product === product ? { ...item, qty: qty } : item) }

            localStorage.setItem('cart', JSON.stringify(newCart))
            return newCart
        }
        case 'UPDATE_CART_ITEM': {
            const { product, qty } = action.payload

            console.log(`Product is ${product} and qty is ${qty}`)

            const newCart = { ...state, cartItems: state.cartItems.map(item => item.product === product ? { ...item, qty: qty } : item) }
            return newCart
        }
        case 'DELETE_LOCAL_CART_ITEM': {
            //array without the deleted exercise 
            const newCart = {
                ...state, cartItems: state.cartItems.filter((item) =>
                    //adds everything true to array 
                    (item.product !== (action.payload))
                )
            }
            localStorage.setItem('cart', JSON.stringify(newCart))

            return newCart
        }
        case 'DELETE_CART_ITEM': {
            //array without the deleted exercise 
            const newCart = {
                ...state, cartItems: state.cartItems.filter((item) =>
                    //adds everything true to array 
                    (item.product !== (action.payload))
                )
            }


            return newCart
        }

        case "GET_ADDRESS":
            return {
                ...state,
                shippingAddress: action.payload
            }
        case "UPDATE_ADDRESS":
            return {
                ...state,
                shippingAddress: { ...action.payload }
            }

        default:
            return state;

    }
}
export default cartReducer