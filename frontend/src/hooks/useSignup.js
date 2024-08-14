import { useState } from "react";
import useAuthContext from "./useAuthContext";

//We create this hook so when a user signups we can update the AuthContext
export const useSignup = () => {
    const [error, setError] = useState(null);
    //true when we start - loading or disable state for button when we submit
    const [isLoading, setIsLoading] = useState(null);

    const { dispatch } = useAuthContext();

    const signup = async (name, email, password) => {
        setIsLoading(true)
        setError(null)


        const response = await fetch('/api/users/signup', {
            method: "POST",
            //json string
            body: JSON.stringify({ name, email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error)
        }
        if (response.ok) {

            //update loading state to be false
            setIsLoading(false)
            /*store json web token in local storage - so if user closes browser and opens it back up
            its still there . save strings into local storage - json is email and token */
            localStorage.setItem('user', JSON.stringify(json))

            //update auth context with email we get back (dispatch login)
            dispatch({ type: 'LOGIN', payload: json })


        }

    }
    //now we can grab all through from useSignup 
    return { signup, isLoading, error, setError }

}