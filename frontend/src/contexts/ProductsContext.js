import { createContext, useReducer } from "react"
import productsReducer from "../reducers/ProductsReducer.js"
import useAuthContext from "../hooks/useAuthContext.js"
import useLogout from "../hooks/useLogout.js"


const ProductsContext = createContext()


//provie context to component tree
export const ProductsContextProvider = ({ children }) => {
    //we get back a state value and function to update it like useState
    //we pass in a custom reducer function and initial state value
    const [state, dispatch] = useReducer(productsReducer, { products: [], product: null, loading: false })
    const { user } = useAuthContext()
    const { logout } = useLogout()


    const listProducts = async (keyword = '', pageNumber = '') => {

        dispatch({ type: "PRODUCT_LIST_REQUEST" })


        const response = await fetch(
            `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
        )
        const data = await response.json()
        if (response.ok) {
            dispatch({
                type: "PRODUCT_LIST_SUCCESS",
                payload: data,
            })
        } else {
            dispatch({
                type: "PRODUCT_LIST_FAIL",
                payload: "Internal Server Error"
            })
        }
    }

    const listProductDetails = async (id) => {

        dispatch({ type: "PRODUCT_DETAILS_REQUEST" })

        const response = await fetch(`/api/products/${id}`)
        const data = await response.json()



        if (response.ok) {
            dispatch({
                type: "PRODUCT_DETAILS_SUCCESS",
                payload: data,
            })
        }
        else {
            dispatch({
                type: "PRODUCT_DETAILS_FAIL",
                payload:
                    data.error
            })
        }
    }

    const deleteProduct = async (id) => {

        dispatch({
            type: "PRODUCT_DELETE_REQUEST",
        })



        const config = {

            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            }
        }

        const response = await fetch(`/api/products/${id}`, config)
        const data = await response.json()

        if (response.ok) {
            dispatch({
                type: "PRODUCT_DELETE_SUCCESS",
                payload: data
            })
        } else {

            dispatch({
                type: "PRODUCT_DELETE_FAIL",
                payload: data.error,
            })
        }
    }

    const createProduct = async () => {

        dispatch({
            type: "PRODUCT_CREATE_REQUEST",
        })


        try {


            const config = {

                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                }
            }

            const response = await fetch(`/api/products`, config)
            const data = await response.json()


            if (response.ok) {
                dispatch({
                    type: "PRODUCT_CREATE_SUCCESS",
                    payload: data,
                })
            } else {

                dispatch({
                    type: "PRODUCT_CREATE_FAIL",
                    payload: data.error
                })
            }
        } catch (error) {
            dispatch({
                type: "PRODUCT_CREATE_FAIL",
                payload: error
            })

        }
    }

    const uploadFile = async (formData) => {

        try {
            const config = {
                method: "POST",
                body: formData
            }

            const response = await fetch('/api/upload', config)

            const data = await response.json()
            if (response.ok) {

                dispatch({
                    type: "IMAGE_UPLOAD_SUCCESS",
                    payload: data,
                })
                return (data)
            } else {
                dispatch({
                    type: "IMAGE_UPLOAD_FAIL",
                    payload: data.error,
                })

            }


        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (message === 'Not authorized, token failed') {
                dispatch(logout())
            }
            console.log(message)
            dispatch({
                type: "IMAGE_UPLOAD_FAIL",
                payload: message,
            })

        }
    }

    const updateProduct = async (product) => {
        dispatch({
            type: "PRODUCT_UPDATE_REQUEST",
        })

        try {

            const response = await fetch(`/api/products/${product._id}`, {

                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(product)
            }
            )
            const data = await response.json()

            if (response.ok) {
                dispatch({
                    type: "PRODUCT_UPDATE_SUCCESS",
                    payload: data,
                })
            } else {
                dispatch({
                    type: "PRODUCT_UPDATE_FAIL",
                    payload: data.error,
                })
            }



        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            if (message === 'Not authorized, token failed') {
                dispatch(logout())
            }
            console.log(message)
            dispatch({
                type: "PRODUCT_UPDATE_FAIL",
                payload: message,
            })
        }
    }

    const createProductReview = async (productId, review) => {

        dispatch({
            type: "PRODUCT_CREATE_REVIEW_REQUEST",
        })


        const response = await fetch(`/api/products/${productId}/reviews`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(review)
        })
        const data = await response.json()
        if (response.ok) {
            dispatch({
                type: "PRODUCT_CREATE_REVIEW_SUCCESS",
                payload: data
            })
        }

        if (!response.ok) {

            dispatch({
                type: "PRODUCT_CREATE_REVIEW_FAIL",
                payload: data.error,
            })
        }
    }

    const listTopProducts = async () => {

        dispatch({ type: "PRODUCT_TOP_REQUEST" })

        const response = await fetch(`/api/products/top`)
        const data = await response.json()
        if (response.ok) {
            dispatch({
                type: "PRODUCT_TOP_SUCCESS",
                payload: data,
            })
        } else {
            dispatch({
                type: "PRODUCT_TOP_FAIL",
                payload: data.error

            })
        }
    }

    console.log('ProductsContext state: ', state)
    /*We wrap part of app that needs access to our context 
    (whole app - index.js App) and access them with the children prop */
    return (
        //We not only provide the products object but we spread the properties in it
        //so it might as well be products, but it would be state.products normally
        <ProductsContext.Provider value={{ ...state, uploadFile, listProducts, listProductDetails, deleteProduct, createProduct, updateProduct, createProductReview, listTopProducts, dispatch }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsContext
