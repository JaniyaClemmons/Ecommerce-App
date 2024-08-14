
import React from "react"
import { LinkContainer } from "react-router-bootstrap"
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'


import { useNavigate } from "react-router-dom"
import useAuthContext from "../hooks/useAuthContext.js"
import useLogout from "../hooks/useLogout.js"
import SearchBox from "./SearchBox"

const Header = () => {

    const { user } = useAuthContext()
    const { logout } = useLogout()
    const history = useNavigate()

    const logoutHandler = () => {
        logout()
        //redirect to /login
        history("/login")
    }

    return (
        <header>

            <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
                <Container >
                    <LinkContainer to="/">
                        <Navbar.Brand href="/"> Ecommerce</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" >
                        <SearchBox />
                        <Nav
                            className="ms-auto"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <LinkContainer to="/cart">
                                <Nav.Link ><i className="fas fa-shopping-cart"> </i> Cart</Nav.Link>
                            </LinkContainer>
                            {user ? (
                                <NavDropdown title={user.name} id='username'>
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}> Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : <LinkContainer to="/login">
                                <Nav.Link><i className="fas fa-user"> </i> Sign In</Nav.Link>
                            </LinkContainer>}
                            {user && user.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}



                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
};

export default Header;
