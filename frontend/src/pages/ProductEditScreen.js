
import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'

import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'
import FormContainer from '../components/FormContainer'
import useProductsContext from '../hooks/useProductsContext.js'

//import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = () => {
    const { id: productId } = useParams()

    const { uploadFile, imageData, listProductDetails, updateProduct, listProducts, loading, error, product, success, dispatch } = useProductsContext()
    const history = useNavigate()
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)



    useEffect(() => {


        if (!product || product._id !== productId) {
            listProductDetails(productId)
        } else {

            setName(product.name)
            setPrice(product.price)
            setImage(product.image)
            setBrand(product.brand)
            setCategory(product.category)
            setCountInStock(product.countInStock)
            setDescription(product.description)
        }

    }, [dispatch, history, productId, product, success])

    const uploadFileHandler = async (e) => {
        dispatch({
            type: "IMAGE_UPLOAD_REQUEST",
        })


        const file = e.target.files[0]
        console.log(file)
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)

        try {

            const config = {
                method: "POST",
                /* headers: {
                     'Content-Type': 'multipart/form-data',
                 },*/

                body: formData
            }

            const response = await fetch('/api/upload', config)
            const data = await response.json()
            if (response.ok) {
                setImage(data)
                setUploading(false)
                dispatch({
                    type: "IMAGE_UPLOAD_SUCCESS",
                    payload: data
                })

            } else {
                dispatch({
                    type: "IMAGE_UPLOAD_FAIL",
                    payload: "image upload failed"
                })

            }


        } catch (error) {
            console.error(error)
            setUploading(false)
        }

        /*await uploadFile(formData)
        if (imageData) {
            setImage(imageData)
            setUploading(false)
        } else {
            console.error("There was an error uploading the file")
            setUploading(false)

        }*/

    }

    const submitHandler = (e) => {
        e.preventDefault()

        updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock,
        })
        dispatch({ type: "PRODUCT_UPDATE_RESET" })
        listProducts()

        history('/admin/productlist')

    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loading && <LoadingBox />}
                {error && <MessageBox variant='danger'>{error}</MessageBox>}
                {loading ? (
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

                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control
                                type="file"
                                //id='image-file'
                                label='Choose File'

                                onChange={uploadFileHandler}
                            ></Form.Control>
                            {uploading && <LoadingBox />}
                        </Form.Group>

                        <Form.Group controlId='brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock'>
                            <Form.Label>Count In Stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter countInStock'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
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

export default ProductEditScreen