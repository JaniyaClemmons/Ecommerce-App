import React, { useEffect } from "react"
import { Container } from "react-bootstrap"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer.js"
import Header from "./components/Header.js"
import Home from "./pages/Home.js"
import ProductScreen from "./pages/ProductScreen.js"
import CartScreen from "./pages/CartScreen.js"
import Signup from "./pages/SignupScreen.js";
import Login from "./pages/LoginScreen.js";
import ProfileScreen from "./pages/ProfileScreen.js";
import ShippingScreen from "./pages/ShippingScreen.js";
import PaymentMethodScreen from "./pages/PaymentMethodScreen.js";
import PlaceOrderScreen from "./pages/PlaceOrderScreen.js";
import OrderScreen from "./pages/OrderScreen.js";
import OrderListScreen from "./pages/OrderListScreen.js";
import UserListScreen from "./pages/UserListScreen.js";
import UserEditScreen from "./pages/UserEditScreen.js";
import ProductListScreen from "./pages/ProductListScreen.js";
import ProductEditScreen from "./pages/ProductEditScreen.js";



function App() {
  //const { user } = useAuthContext();
  let user = localStorage.getItem('user')


  useEffect(() => {
    user = localStorage.getItem('user')

  })
  return (
    <BrowserRouter>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>

            <Route path='/' element=<Home /> exact />
            <Route path='/search' element=<Home /> exact />
            <Route path='/page/:pageNumber' element=<Home /> exact />
            <Route
              path='/search/:keyword/page/:pageNumber'
              element=<Home />
              exact
            />
            <Route path='/products/:id' element=<ProductScreen /> />
            <Route path='/cart/:id?' element=<CartScreen /> />
            <Route
              path="/signup"
              element=<Signup />
            />

            <Route
              //find another way to protect this route becuase the redirect back to shipping not working 
              path="/login"
              element=<Login /> /*{!user ? <Login /> : <Navigate to="/" />}*/
            />
            <Route
              path="/profile"
              element={!user ? <Login /> : <ProfileScreen />}
            />
            <Route
              path="/shipping"
              element={!user ? <Login /> : <ShippingScreen />}
            />
            <Route
              path="/payment"
              element={!user ? <Login /> : <PaymentMethodScreen />}
            />
            <Route
              path="/placeorder"
              element={!user ? <Login /> : <PlaceOrderScreen />}
            />
            <Route
              path="/order/:id"
              element=<OrderScreen />
            />
            <Route
              path="/admin/orderlist"
              element=<OrderListScreen />
            />
            <Route
              path="/admin/userlist"
              element=<UserListScreen />
            />
            <Route path='/admin/users/:id/edit' element=<UserEditScreen /> />
            <Route
              path='/admin/productlist'
              element=<ProductListScreen />

            />
            <Route
              path='/admin/productlist/:pageNumber'
              element=<ProductListScreen />

            />
            <Route path='/admin/product/:id/edit' element=<ProductEditScreen /> />

          </Routes>
        </Container>

      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App;
