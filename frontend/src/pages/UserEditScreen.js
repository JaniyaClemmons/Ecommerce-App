import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

import MessageBox from '../components/MessageBox.js'
import LoadingBox from '../components/LoadingBox.js'
import FormContainer from '../components/FormContainer.js'
import { useProfile } from '../hooks/useProfile.js'
import useAuthContext from '../hooks/useAuthContext.js'




const UserEditScreen = () => {

    const history = useNavigate()
    const { getUserDetails, updateUser, listUsers, loading, error, otherUser, success, getProfile, user } = useProfile()
    //const { user } = useAuthContext()
    const { id: userId } = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        // getProfile()

        /*if (success) {
            history('/admin/userlist')

        } else {*/

        if (!otherUser || otherUser._id !== userId) {
            console.log(userId)
            getUserDetails(userId)

        } else {
            setName(otherUser.name)
            setEmail(otherUser.email)
            setIsAdmin(otherUser.isAdmin)
        }
        //}
    }, [history, userId, otherUser])

    const submitHandler = (e) => {
        e.preventDefault()
        //console.log(name)
        updateUser({ _id: userId, name, email, isAdmin })
        listUsers()
        history('/admin/userlist')
    }

    return (
        <>
            <Link to='/admin/userlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>

                {error && <MessageBox variant='danger'>{error}</MessageBox>}
                {loading || !otherUser || !user ? (
                    <LoadingBox />
                ) : error ? (
                    <MessageBox variant='danger'>{error}</MessageBox>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='isadmin'>
                            <Form.Check
                                disabled={user._id === userId}
                                type='checkbox'
                                label='Is Admin'
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>

                        <Button type='submit' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default UserEditScreen