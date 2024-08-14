import OrdersContext from "../contexts/OrdersContext.js";
import { useContext } from "react";

//everytime we need exercise data we just need to call this function 
const useOrdersContext = () => {

    //value we passed into provider component 
    const context = useContext(OrdersContext)

    //If outside of wrapped components, will be null 
    if (!context) {
        throw Error("useOrdersContext must be used inside an OrdersContextProvider");
    }

    //dispatch function and exercise object  
    return context;
}

export default useOrdersContext