import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import MessageBox from '../components/MessageBox'
import LoadingBox from '../components/LoadingBox'
import Paginate from '../components/Paginate'
import useProductsContext from '../hooks/useProductsContext'
import { useParams, useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext.js"


//import { PRODUCT_CREATE_RESET } from '../constants/productConstants'




const ProductListScreen = () => {
    const navigate = useNavigate()
    const { listProducts, listProductDetails,
        deleteProduct, createProduct,
        product, loading, error, deleteSuccess, success, products, page, pages, dispatch } = useProductsContext()
    const pageNumber = useParams().pageNumber || 1


    /*const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete

    const productCreate = useSelector((state) => state.productCreate)
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: product,
    } = productCreate*/
    const { user } = useAuthContext()


    useEffect(() => {


        if (!user || !user.isAdmin) {
            navigate('/login')
        }


        listProducts('', pageNumber)

    }, [
        //dispatch,
        //navigate,

        user,
        deleteSuccess,
        pageNumber,
    ])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
            deleteProduct(id)
            listProducts('', pageNumber)
        }

    }

    const createProductHandler = () => {
        createProduct()
        listProducts('', pageNumber)

    }
    const handleClick = (event) => {
        const productId = event.currentTarget.name;
        //listProductDetails(productId)

        navigate(`/admin/product/${productId}/edit`)
    }

    return (
        <>
            <Row className='align-items-center'>
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Create Product
                    </Button>
                </Col>
            </Row>
            {/*loadingDelete && <LoadingBox />*/}
            {/*errorDelete && <MessageBox variant='danger'>{errorDelete}</MessageBox>*/}
            {/*loadingCreate && <LoadingBox />*/}
            {/*errorCreate && <MessageBox variant='danger'>{errorCreate}</MessageBox>*/}
            {loading ? (
                <LoadingBox />
            ) : error ? (
                <MessageBox variant='danger'>{error}</MessageBox>
            ) : (
                <>
                    <Table striped bordered hover responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>PRICE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>

                                        <Button onClick={handleClick} name={product._id} variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>

                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} />
                </>
            )}
        </>
    )
}

export default ProductListScreen