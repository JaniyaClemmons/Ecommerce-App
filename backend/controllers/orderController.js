/**
 * Functions to query db 
 */
import Product from "../models/productModel.js"
import Order from "../models/orderModel.js"
import mongoose from "mongoose"
import asyncHandler from "express-async-handler"



//get all orders (admin)
export const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'id name');
    res.status(200).json(orders);
})

//Create an order
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ error: "No items in order" });

    } else {
        const order = new Order({
            //get user from token since protected route
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        })
        const createdOrder = await order.save()
        //201 since something created 
        res.status(201).json(createdOrder)
    }

})
//get order by id 
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    )
    if (order) {
        res.status(200).json(order)
    } else {
        res.status(404).json({ error: 'Order Not Found' })
    }
})
//get all users orders
export const getMyOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({ user: req.user._id })
    res.status(200).json(orders)

})

//mark as delivered (admin)
export const markAsDelivered = asyncHandler(async (req, res) => {

    console.log(req.params.id)
    const order = await Order.findById(req.params.id).populate(
        'user',
        'email name'
    )
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        console.log(updatedOrder)
        res.status(200).json(updatedOrder)

    } else {
        res.status(404).json({ error: 'Order not found' })
    }
})
//mark order as paid (admin)
export const markAsPayed = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'email name'
    );
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        }
        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404).json({ error: error.message });
    }
})

//Delete order (admin)
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        await order.deleteOne()
        //deleted order
        res.status(200).json(order);


    } else {
        res.status(404).json({ error: error.message });
    }
})

export const orderSummary = asyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                numOrders: { $sum: 1 },
                totalSales: { $sum: '$totalPrice' },
            },
        },
    ]);
    const users = await User.aggregate([
        {
            $group: {
                _id: null,
                numUsers: { $sum: 1 },
            },
        },
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                orders: { $sum: 1 },
                sales: { $sum: '$totalPrice' },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
            },
        },
    ]);
    res.json({ users, orders, dailyOrders, productCategories });
})





export default createOrder