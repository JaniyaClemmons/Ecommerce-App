import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useSignup } from '../hooks/useSignup.js'
import MessageBox from '../components/MessageBox.js'

const SignupScreen = () => {
    const navigate = useNavigate()
    const { search } = useLocation()
    const { signup, error, isLoading, setError } = useSignup()
    const [message, setMessage] = useState(null)
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    /*const redirect = location.search ? location.search.split('=')[1] : '/'*/

    const handleSubmit = async (event) => {
        setError(null)

        event.preventDefault()

        if (user.password !== user.confirmPassword) {

            setMessage('Passwords do not match')

            //toast.error('Passwords do not match');
            //return;
        } else {
            //console.log(user); 
            setMessage(null)

            await signup(user.name, user.email, user.password)
            navigate(redirect)
        }


    }

    function handleChange(event) {

        //console.log(event.target.value);
        const { name, value } = event.target;
        setUser(prevValue => {
            return ({ ...prevValue, [name]: value })
        })
    }



    return (<Container className="small-container">

        <h1 className="my-3">Sign Up</h1>

        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    onChange={handleChange}
                    name="name"
                    placeholder="User Name"
                    value={user.name}
                    //className = {emptyFields.includes('name')? 'error': ''}
                    required />
            </Form.Group>

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
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handleChange}
                        name="confirmPassword"
                        placeholder="confirm password"
                        value={user.confirmPassword}
                        required
                    />
                </Form.Group>
            </Form.Group>
            <div className="mb-3">
                <Button type="submit" disabled={isLoading}>Sign Up</Button>
                {/*error && <div className="error">{error}</div>*/}
                {/*message && <div className="error">{message}</div>*/}
                {message && <MessageBox variant='danger'>{message}</MessageBox>}
                {error && <MessageBox variant='danger'>{error}</MessageBox>}

            </div>
            {<div className="mb-3">
                Already have an account?{' '}
                <Link to='/login'>Sign-In</Link>
            </div>}
        </Form>
    </Container>
    )
}

export default SignupScreen;
