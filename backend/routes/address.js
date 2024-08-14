import express from 'express'
const router = express.Router()
//middleware
import requireAuth from "../middleware/requireAuth.js"


//controller functions 
import getShippingAddress, { updateShippingAddress, createShippingAddress } from "../controllers/addressController.js"

//fire middleware - req auth for all the following functions 
router.use(requireAuth);


router.post('/', createShippingAddress)


router.get('/', getShippingAddress)

//@desc Update user address
//@route PUT /api/address
//@access Private
router.put('/', updateShippingAddress)



export default router