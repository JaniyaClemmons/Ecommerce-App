import { useState } from "react";
import useAuthContext from "./useAuthContext.js";

//We create this hook so when a user signups we can update the AuthContext
const useLogin = () => {
    //const [error, setError] = useState(null);
    //true when we start - loading or disable state for button when we submit
    //const [isLoading, setIsLoading] = useState(null);

    const { error, loading, success, dispatch } = useAuthContext();

    const login = async (email, password) => {
        //setIsLoading(true)
        //setError(null)

        dispatch({ type: 'LOGIN_REQUEST' })
        const response = await fetch('/api/users/login', {
            method: "POST",
            //json string
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await response.json();
        if (response.ok) {

            //update loading state to be false
            //setIsLoading(false)
            /*store json web token in local storage - so if user closes browser and opens it back up
            its still there . save strings into local storage - json is email and token */
            localStorage.setItem('user', JSON.stringify(json))

            //update auth context with email we get back (dispatch login)
            dispatch({ type: 'LOGIN_SUCCESS', payload: json })
            //return true


        }
        else {
            /*setIsLoading(false)
            setError(json.error)*/
            //console.log(json.error)
            dispatch({ type: 'LOGIN_FAIL', payload: json.error })

        }


    }
    //now we can grab all through from useSignup 

    return { login, error, loading, success }//, isLoading, error }

}
export default useLogin