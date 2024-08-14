import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './bootstrap.min.css'
import App from './App'
import { ProductsContextProvider } from './contexts/ProductsContext.js';
import { CartContextProvider } from './contexts/CartContext'
import { AuthContextProvider } from './contexts/AuthContext'
import { OrdersContextProvider } from './contexts/OrdersContext'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(

  <AuthContextProvider>
    <PayPalScriptProvider>
      <OrdersContextProvider>
        <ProductsContextProvider>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </ProductsContextProvider>
      </OrdersContextProvider>
    </PayPalScriptProvider>
  </AuthContextProvider>


)

