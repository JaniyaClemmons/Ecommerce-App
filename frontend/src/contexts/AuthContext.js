import { createContext, useReducer, useEffect } from "react";

import AuthReducer from "../reducers/userReducer.js"



const AuthContext = createContext();

//provide context to component tree
export const AuthContextProvider = ({ children }) => {
    //we get back a state value and function to update it like useState
    //we pass in a custom reducer function and initial state value
    const initialState = {
        user: JSON.parse(localStorage.getItem('user')),
        users: [],
        loading: false
    };

    const [state, dispatch] = useReducer(AuthReducer, initialState)


    //We use this to check if user in local storage on page laod 
    //arg 2 empty array to fire function once on app load
     useEffect(() => {
 
         const user = JSON.parse(localStorage.getItem('user'))
         //check for token in local starage - from string to obj 
 
 
         if (user) {
             dispatch({ type: 'LOGIN_REQUEST', payload: user })
 
         }
 
 
     }, []);

    console.log('AuthContext state: ', state)

    /*We wrap part of app that needs access to our context 
    (whole app - index.js App) and access them with the children prop */
    return (
        //We not only provide the exercises object but we spread the properties in it
        //so it might as well be exercises, but it would be state.exercises normally
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext