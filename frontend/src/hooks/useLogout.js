import useAuthContext from "./useAuthContext.js"
//import useOrdersContext from "./useOrdersContext"


//We create this hook so when a user signups we can update the AuthContext
const useLogout = () => {

    const { dispatch } = useAuthContext()
    //const { dispatch: ordersDispatch } = useOrdersContext()


    const logout = () => {

        /* delete json web token in local storage  */
        localStorage.removeItem('user')
        localStorage.removeItem('paymentMethod')
        localStorage.removeItem('cart')
        //update auth context with email we get back (dispatch login)
        dispatch({ type: 'LOGOUT' })
        dispatch("USER_LIST_RESET")
        //ordersDispatch("ORDER_LIST_MY_RESET")

    }
    return { logout }

}
export default useLogout