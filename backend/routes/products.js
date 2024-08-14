/**
 * Register Routes 
 */

import express from "express"

/*//middleware
import requireAuth from "../middleware/requireAuth.js"*/


import {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
}
    //deleteProduct,
    //updateProduct
    from "../controllers/productController.js"
import { isAdmin } from '../utils.js';
import requireAuth from "../middleware/requireAuth.js"




const router = express.Router();

//fire middleware - req auth for all the following functions 
//router.use(requireAuth);

/*Now we use router.get/post/delete/update the same way we used app before 
router.get('/', (req, res) => {})*/

//GET all Products
//router.get('/', getProducts);
router.route('/').get(getProducts).post(requireAuth, isAdmin, createProduct)

router.route('/:id/reviews').post(requireAuth, createProductReview)

router.get('/top', getTopProducts)


//GET a single Product by id
//:id is a parameter
//router.get('/:id', getProduct);

router
    .route('/:id')
    .get(getProductById)
    .delete(requireAuth, isAdmin, deleteProduct)
    .put(requireAuth, isAdmin, updateProduct)


export default router

