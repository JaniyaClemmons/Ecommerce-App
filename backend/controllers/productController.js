/**
 * Functions to query db 
 */
import Product from "../models/productModel.js"
import User from "../models/userModel.js"
import mongoose from "mongoose"
import asyncHandler from "express-async-handler"

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 2;

    const page = Number(req.query.pageNumber) || 1;

    const query = req.query.keyword;

    let keyword = {};


    if (!(query === 'null')) {
        keyword = {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            }
        }
    }
    else {
        keyword = {}
    }


    /*empty object for find all, sort by field in descending order (new first)
    const products = await Product.find({}).sort({ createdAt: -1 });*/
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1))



    res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {

    //const Product = await Product.findById({id: req.body.params.id});  
    const { id } = req.params;

    //make sure id is valid mongo type id so an invalid id doesnt crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such Product" });
    }
    const product = await Product.findById(id);

    if (!product) {
        //404 not found
        return res.status(404).json({ error: "No such Product" })
    }
    res.status(200).json(product)

})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
        rating: 4.5
    })
    try {
        await product.save()

        const products = await Product.find({})
        //list of products 
        res.status(201).json(products)

    } catch (error) {
        res.status(400).json({ error: "Bad Request: Could not create product" })
    }

})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.deleteOne()
        const products = await Product.find({})
        //list of products 
        res.status(200).json(products)

    } else {
        res.status(404).json({ error: 'Product not found' })
    }

})
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
    } = req.body

    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        const updatedProduct = await product.save()
        res.status(200).json(updatedProduct)
    } else {
        res.status(404).json({ error: 'Product not found' })

    }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const { _id } = req.user
    const user = await User.findById(_id)


    const product = await Product.findById(req.params.id)

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user._id.toString()
        )

        if (alreadyReviewed) {
            res.status(400).json({ error: 'Product already reviewed' })
        }
        else {


            const review = {
                name: user.name,
                rating: Number(rating),
                comment,
                user: user._id,
            }


            product.reviews.push(review)

            product.numReviews = product.reviews.length

            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length

            await product.save()
            res.status(201).json(product)
        }
    } else {
        res.status(404).json({ error: 'Product not found' })
    }

})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    res.status(200).json(products)
})


export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
}

