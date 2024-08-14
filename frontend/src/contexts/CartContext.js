import { createContext, useReducer, useEffect } from "react"
import cartReducer from "../reducers/CartReducer.js"
import useAuthContext from "../hooks/useAuthContext.js"





const CartContext = createContext()

const cart = {
    cartItems: [],
    paymentMethod: "",
    shippingAddress: null
}
//provie context to component tree
export const CartContextProvider = ({ children }) => {
    //we get back a state value and function to update it like useState
    //we pass in a custom reducer function and initial state value
    const [state, dispatch] = useReducer(cartReducer, cart)

    const { user } = useAuthContext()
    //let user = localStorage.getItem('user')



    useEffect(() => {

        //user = localStorage.getItem('user')
        //Global User Context 
        if (user) {

            try {


                const getCartItems = async () => {
                    //Get Users Cart
                    const response = await fetch(`/api/users/cart`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })

                    const cart = await response.json();

                    //combine the 2 carts if cart on local storage 

                    if (localStorage.getItem('cart')) {
                        const items = JSON.parse(localStorage.getItem('cart')).cartItems;


                        const mergedCart = [...cart, ...items].filter((obj, idx) => [...cart, ...items].findIndex((item) =>
                            item.product === obj.product
                        ) === idx
                        )

                        localStorage.removeItem('cart')

                        const payload = mergedCart.map((item) => ({
                            product: item.product,
                            qty: item.qty
                        }))

                        const response = await fetch('/api/users/cart/replace', {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                                "Content-Type": "application/json"

                            },

                            body: JSON.stringify(payload)

                        })

                        const updatedCart = await response.json()

                        dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart });

                    }
                    //No Local cart, only db cart
                    else {
                        dispatch({ type: 'SET_CART_ITEMS', payload: cart })
                    }

                }
                //Get address from db
                const setAddress = async () => {
                    try {
                        const response = await fetch("/api/address", {
                            headers: {
                                'Authorization': `Bearer ${user.token}`
                            }
                        })
                        //pass the json into something we can work with - array of obj
                        const data = await response.json();


                        if (response.ok) {
                            dispatch({ type: 'GET_ADDRESS', payload: data })

                        }
                    } catch (err) {
                        console.log(err)
                    }
                }

                setAddress()
                getCartItems()
            } catch (err) {
                console.log(err);
            }
        } //No User Logged In 
        else {


            //If local cart
            if (localStorage.getItem('cart')) {
                const items = JSON.parse(localStorage.getItem('cart')).cartItems;
                items &&
                    dispatch({ type: 'SET_CART_ITEMS', payload: items });

            }
            //No cart locally 
            else {
                dispatch({ type: 'SET_CART_ITEMS', payload: [] })
            }

        }
    }, [user])

    const savePaymentMethod = async (method) => {
        dispatch({ type: 'SAVE_PAYMENTMETHOD', payload: method })
    }

    const addToCart = async (id, qty) => {
        //const user = JSON.parse(localStorage.getItem('user'))

        if (!user) {
            try {
                dispatch({ type: 'SENDING_REQUEST' });
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    const payload = {
                        product: data._id,
                        name: data.name,
                        image: data.image,
                        price: data.price,
                        countInStock: data.countInStock,
                        qty: qty
                    }


                    dispatch({ type: 'REQUEST_FINISHED' });
                    dispatch({ type: 'ADD_ITEM_TO_LOCAL_CART', payload: { ...payload } })


                }

            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                dispatch({ type: 'SENDING_REQUEST' });
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                const payload = {
                    product: data._id,
                    name: data.name,
                    image: data.image,
                    price: data.price,
                    countInStock: data.countInStock,
                    qty: qty
                }


                dispatch({ type: 'REQUEST_FINISHED' });
                const response = await fetch('/api/users/cart', {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"

                    },
                    //json string
                    body: JSON.stringify(payload)

                })

                const updatedCart = await response.json()



                dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart });

            } catch (err) {
                console.log(err);
            }
        }
    }
    const updateCartQty = async (id, qty) => {

        //const user = JSON.parse(localStorage.getItem('user'))

        if (!user) {
            try {
                dispatch({ type: 'SENDING_REQUEST' });
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();

                const payload = {
                    product: data._id,
                    name: data.name,
                    image: data.image,
                    price: data.price,
                    countInStock: data.countInStock,
                    qty: qty
                }


                dispatch({ type: 'REQUEST_FINISHED' });

                dispatch({ type: 'UPDATE_LOCAL_CART_ITEM', payload: { ...payload } })

            } catch (err) {
                console.log(err);
            }
        }
        else {
            try {
                dispatch({ type: 'SENDING_REQUEST' });
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();

                const payload = {
                    product: data._id,
                    name: data.name,
                    image: data.image,
                    price: data.price,
                    countInStock: data.countInStock,
                    qty: qty
                }


                dispatch({ type: 'REQUEST_FINISHED' });

                const response = await fetch('/api/users/cart/qty', {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"

                    },
                    //json string
                    body: JSON.stringify(payload)

                })
                const updatedCart = await response.json()



                dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart });

            } catch (err) {
                console.log(err);
            }

        }

    }

    const removeFromCart = async (id) => {
        //const user = JSON.parse(localStorage.getItem('user'))

        try {


            if (!user) {
                const newCart = dispatch({ type: 'DELETE_LOCAL_CART_ITEM', payload: id })
                localStorage.setItem('cart', JSON.stringify(newCart))
            } else {
                const response = await fetch('/api/users/cart', {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"

                    },
                    //json string
                    body: JSON.stringify({ product: id })

                })

                const updatedCart = await response.json()

                dispatch({ type: 'SET_CART_ITEMS', payload: updatedCart })
            }

        } catch (err) {
            console.log(err);
        }
    }
    const clearCart = async () => {
        try {
            const response = await fetch('/api/users/wholeCart', {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json"

                }
            })
            const data = await response.json()
            await console.log(data)
            const old = JSON.parse(localStorage.getItem('user'))

            localStorage.setItem('user', JSON.stringify({ ...old, cartItems: data }))


            dispatch({ type: 'SET_CART_ITEMS', payload: data })
        } catch (err) {
            console.log(err);
        }
    }



    console.log('CartContext state: ', state)
    /*We wrap part of app that needs access to our context 
    (whole app - index.js App) and access them with the children prop */
    return (
        //We not only provide the products object but we spread the properties in it
        //so it might as well be products, but it would be state.products normally
        <CartContext.Provider value={{ ...state, clearCart, addToCart, updateCartQty, removeFromCart, dispatch, savePaymentMethod/*, createProduct, updateProduct, deleteProduct */ }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext
