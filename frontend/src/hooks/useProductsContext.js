import ProductsContext from "../contexts/ProductsContext.js";
import { useContext } from "react";

//everytime we need exercise data we just need to call this function 
const useProductsContext = () => {

    //value we passed into provider component 
    const context = useContext(ProductsContext)

    //If outside of wrapped components, will be null 
    if (!context) {
        throw Error("useProductsContext must be used inside an ProductsContextProvider");
    }

    //dispatch function and exercise object  
    return context;
}

export default useProductsContext