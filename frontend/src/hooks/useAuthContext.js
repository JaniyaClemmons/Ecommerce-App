import AuthContext from "../contexts/AuthContext.js";
import { useContext } from "react";

//everytime we need exercise data we just need to call this function 
const useAuthContext = () => {

    //value we passed into provider component 
    const context = useContext(AuthContext)

    //If outside of wrapped components, will be null 
    if (!context) {
        throw Error("useAuthContext must be used inside an AuthContextProvider");
    }

    //user variable and dispatch function 
    return context;
}
export default useAuthContext