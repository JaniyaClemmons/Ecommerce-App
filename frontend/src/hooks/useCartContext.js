import CartContext from "../contexts/CartContext.js";
import { useContext } from "react";

//everytime we need exercise data we just need to call this function 
const useCartContext = () => {


    //value we passed into provider component 
    const context = useContext(CartContext)

    //If outside of wrapped components, will be null 
    if (!context) {
        throw Error("useCartContext must be used inside an CartContextProvider");
    }



    //dispatch function and exercise object  
    return context;
}

export default useCartContext