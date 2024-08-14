
import { useState } from "react";
import useAuthContext from "./useAuthContext.js";
import useLogout from "../hooks/useLogout.js"

//We create this hook so when a user signups we can update the AuthContext
export const useProfile = () => {
    //const userInfo = JSON.parse(localStorage.getItem('user'))
    const { user, users, dispatch, otherUser, error, success, loading } = useAuthContext();
    const { logout } = useLogout()
    //const [error, setError] = useState(null);
    //const [success, setSuccess] = useState(false)
    //true when we start - loading or disable state for button when we submit
    //const [isLoading, setIsLoading] = useState(null);



    const getProfile = async () => {
        //setIsLoading(true)
        //setError(null)
        dispatch({ type: 'USER_DETAILS_REQUEST' })

        const response = await fetch("/api/users/profile", {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        //pass the json into something we can work with - array of obj
        const json = await response.json();


        if (!response.ok) {
            //setIsLoading(false)
            //setError(json.error)
            dispatch({ type: 'USER_DETAILS_FAIL', payload: json })

        }
        if (response.ok) {

            //update loading state to be false
            //setIsLoading(false)


            await dispatch({ type: 'USER_DETAILS_SUCCESS', payload: json })



        }

    }


    //from profile screen
    const updateProfile = async (name, email, password) => {
        //setIsLoading(true)
        //setError(null)
        //setSuccess(null)
        //put request
        dispatch({ type: 'USER_UPDATE_PROFILE_REQUEST' })

        const response = await fetch('/api/users/profile', {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json"

            },
            //json string
            body: JSON.stringify({ name, email, password })

        })
        //pass the json into something we can work with - array of obj
        const json = await response.json()


        if (!response.ok) {
            //setIsLoading(false)
            //setError(json.error)
            dispatch({ type: 'USER_UPDATE_PROFILE_FAIL', payload: json.error })

        }
        if (response.ok) {

            //update loading state to be false
            //setIsLoading(false)
            //setSuccess(true)
            const old = JSON.parse(localStorage.getItem('user'))
            /*console.log(old)
            console.log(json)
            console.log({ ...old, ...json })*/
            localStorage.setItem('user', JSON.stringify({ ...old, ...json }))


            dispatch({ type: 'USER_UPDATE_PROFILE_SUCCESS', payload: JSON.parse(localStorage.getItem('user')) })


        }

    }

    //admin
    const getUserDetails = async (id) => {
        //setIsLoading(true)
        //setError(null)

        dispatch({ type: 'OTHER_USER_DETAILS_REQUEST' })
        const response = await fetch(`/api/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        //pass the json into something we can work with - array of obj
        const json = await response.json();

        //update loading state to be false


        if (response.ok) {
            dispatch({ type: 'OTHER_USER_DETAILS_SUCCESS', payload: json })
        } else {

            dispatch({ type: 'OTHER_USER_DETAILS_FAIL', payload: json.error })
        }
    }
    //admin
    const updateUser = async (userInfo) => {

        dispatch({
            type: "OTHER_USER_UPDATE_REQUEST",
        })



        const response = await fetch(`/api/users/${userInfo._id}`, {

            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(userInfo)
        }
        )

        const json = await response.json()


        if (response.ok) {
            if (userInfo._id === user._id) {
                console.log("admin udating themselves, update local storage")
                const old = JSON.parse(localStorage.getItem('user'))
                localStorage.setItem('user', JSON.stringify({ ...old, ...json }))

                dispatch({ type: "USER_UPDATE_PROFILE_SUCCESS", payload: JSON.parse(localStorage.getItem('user')) })
                dispatch({ type: "OTHER_USER_UPDATE_SUCCESS", payload: JSON.parse(localStorage.getItem('user')) })

            } else {
                console.log("not updating the current user")
                dispatch({ type: "OTHER_USER_UPDATE_SUCCESS", payload: json })
            }

        } else {
            dispatch({
                type: "OTHER_USER_UPDATE_FAIL",
                payload: json.error,
            })

        }




    }

    const listUsers = async () => {
        try {
            dispatch({
                type: "USER_LIST_REQUEST",
            })

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const response = await fetch(`/api/users`, config)
            const data = await response.json()

            dispatch({
                type: "USER_LIST_SUCCESS",
                payload: data
            })
        } catch (error) {

            dispatch({
                type: "USER_LIST_FAIL",
                payload: "List users failed",
            })
        }
    }
    const deleteUser = async (id) => {

        dispatch({
            type: "USER_DELETE_REQUEST",
        })



        const config = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }

        const response = await fetch(`/api/users/${id}`, config)
        const data = await response.json()

        if (response.ok) {
            dispatch({ type: "USER_DELETE_SUCCESS", payload: data })

        }
        else {
            dispatch({
                type: "USER_DELETE_FAIL",
                payload: data.error,
            })

        }


    }

    //now we can grab all through from useProfile 
    return { otherUser, user, users, getProfile, getUserDetails, updateProfile, updateUser, listUsers, deleteUser, loading, error, success }

}
export default useProfile
