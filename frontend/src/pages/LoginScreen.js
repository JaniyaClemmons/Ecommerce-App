import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import useLogin from '../hooks/useLogin.js'
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

const LoginScreen = () => {
    const navigate = useNavigate()
    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')

    //const redirectInUrl = useParams('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'


    const { login, error, loading, success } = useLogin()
    //console.log(loading)
    const [user, setUser] = useState({

        email: "",
        password: ""

    })
    //if already logged in, take me to redirect 
    useEffect(() => {
        const loggedIn = JSON.parse(localStorage.getItem('user'))
        if (loggedIn) {

            navigate(redirect);
        }
    }, [navigate, redirect])

    /*const redirect = location.search ? location.search.split('=')[1] : '/'*/

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (await login(user.email, user.password)) {
            navigate(redirect);
        }




    }

    function handleChange(event) {

        const { name, value } = event.target;
        setUser(prevValue => {
            return ({ ...prevValue, [name]: value })
        })
    }



    return (
        <Container className="small-container">
            <h1 className="my-3">Sign In</h1>
            {error && <MessageBox variant="danger">{error}</MessageBox>}
            {loading && <LoadingBox></LoadingBox>}
            <Form onSubmit={handleSubmit}>


                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        onChange={handleChange}
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handleChange}
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        required
                    />

                </Form.Group>
                <div className="mb-3">
                    <Button type="submit" disabled={loading}>Sign In</Button>

                </div>
                <div className="mb-3">
                    New Customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Register</Link>
                </div>
                <div className="mb-3">
                    Forget Password? <Link to={`/forgot-password`}>Reset Password</Link>
                </div>
            </Form>
        </Container>


    )
}


export default LoginScreen;
