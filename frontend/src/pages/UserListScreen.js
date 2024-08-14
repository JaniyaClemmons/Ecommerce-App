import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useProfile } from '../hooks/useProfile.js'
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'



const UserListScreen = () => {
    const { listUsers, deleteUser, getUserDetails, loading, error, users, user: currentUser } = useProfile()
    const navigate = useNavigate()


    useEffect(() => {

        if (currentUser && currentUser.isAdmin) {

            listUsers()

        } else {
            navigate('/login')
        }

    }, [currentUser, navigate])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            deleteUser(id)
        }
    }
    const handleClick = (event) => {
        const usersId = event.currentTarget.name

        getUserDetails(usersId)

        navigate(`/admin/users/${usersId}/edit`)

    }

    return (
        <>
            <h1>Users</h1>
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>
                                    <a href={`mailto:${user.email}`}>{user.email}</a>
                                </td>
                                <td>
                                    {user.isAdmin ? (
                                        <i className='fas fa-check' style={{ color: 'green' }}></i>
                                    ) : (
                                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                                    )}
                                </td>
                                <td>

                                    <Button name={user._id} onClick={handleClick} variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>

                                    <Button
                                        disabled={currentUser._id === user._id}
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteHandler(user._id)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    )
}

export default UserListScreen