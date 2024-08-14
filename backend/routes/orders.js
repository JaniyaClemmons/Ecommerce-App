import express from 'express'
const router = express.Router()

//middleware
import requireAuth from "../middleware/requireAuth.js"
import { isAdmin } from '../utils.js';


//controller functions 
import createOrder, { getOrders, markAsDelivered, markAsPayed, orderSummary, deleteOrder, getOrderById, getMyOrders } from "../controllers/orderController.js"


//@desc Auth user & create new order 
//@route POST /api/orders
//@access Private 
router.post('/', requireAuth, createOrder)

//@desc Auth user & Admin get all orders 
//@route POST /api/orders
//@access Private 
router.get('/', requireAuth, getOrders)

//@desc Auth user & Admin get orders summary
//@route POST /api/orders
//@access Private 
router.get('/summary', requireAuth, isAdmin, orderSummary)

//@desc Auth user & get order history 
//@route POST /api/orders
//@access Private 
router.get('/myorders', requireAuth, getMyOrders)

//@desc Auth user & get order by id
//@route POST /api/orders
//@access Private 
router.get('/:id', requireAuth, getOrderById)

//@desc Auth user & Admin mark as deivered
//@route POST /api/orders
//@access Private 
router.put('/:id/delivered', requireAuth, isAdmin, markAsDelivered)

//@desc Auth user & Admin mark as payed
//@route POST /api/orders
//@access Private 
router.put('/:id/pay', requireAuth, markAsPayed)

//@desc Auth user & Admin delete order
//@route POST /api/orders
//@access Private 
router.delete('/:id', requireAuth, deleteOrder)





export default router