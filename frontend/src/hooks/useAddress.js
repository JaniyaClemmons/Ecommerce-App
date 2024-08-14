import { useState } from "react";
import useAuthContext from "./useAuthContext.js";
import useCartContext from "./useCartContext.js";

//We create this hook so when a user signups we can update the AuthContext
export const useAddress = () => {
    const { user } = useAuthContext();
    const { dispatch } = useCartContext();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false)
    //true when we start - loading or disable state for button when we submit
    const [isLoading, setIsLoading] = useState(null);


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
    //dont need both updated and create new address
    const updateAddress = async (updates) => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)
        //put request
        const response = await fetch('/api/address', {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"

            },
            //json string
            body: JSON.stringify(updates)

        })
        //pass the json into something we can work with - array of obj
        const json = await response.json()

        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            const { fullName, city, address, state, postalCode, country } = json

            //update loading state to be false
            setIsLoading(false)
            setSuccess(true)
            /*const old = JSON.parse(localStorage.getItem('user'))
            localStorage.setItem('user', JSON.stringify({ ...old, ...json.userInfo }))*/
            const newAddress = {
                fullName, city, address, state, postalCode, country
            }


            dispatch({ type: 'UPDATE_ADDRESS', payload: { ...newAddress }/*json.userInfo*/ })


        }

    }
    const createAddress = async (newAddress) => {
        setIsLoading(true)
        setError(null)
        setSuccess(null)
        //put request
        const response = await fetch('/api/address', {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"

            },
            //json string
            body: JSON.stringify({ ...newAddress })

        })
        //pass the json into something we can work with - array of obj
        const data = await response.json()
        console.log(data)

        if (!response.ok) {
            setIsLoading(false)
            setError(data.error)
        }
        if (response.ok) {
            const { fullName, city, state, address, postalCode, country } = data

            //update loading state to be false
            setIsLoading(false)
            setSuccess(true)
            /*const old = JSON.parse(localStorage.getItem('user'))
            localStorage.setItem('user', JSON.stringify({ ...old, ...json.userInfo }))*/

            const newAddress = {
                fullName, city, state, address, postalCode, country
            }
            dispatch({ type: 'UPDATE_ADDRESS', payload: { ...newAddress } /*json.userInfo*/ })


        }

    }

    return { updateAddress, createAddress, setAddress, isLoading, error, success }

}
export default useAddress
