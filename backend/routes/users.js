import express from 'express'
const router = express.Router()
//middleware
import requireAuth from "../middleware/requireAuth.js"
import { isAdmin } from '../utils.js';


//controller functions 
import signupUser, { clearCart, getUserById, updateUser, deleteUser, getUsers, loginUser, getUserProfile, updateUserProfile, addItemToCart, getCartItems, updateCartQty, removeCartItem, replaceCart } from "../controllers/userController.js"


//@desc Auth user & get token 
//@route POST /api/users/login
//@access Public 
router.post('/login', loginUser)

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
router.get('/', requireAuth, isAdmin, getUsers)



//@desc Auth user & get token 
//@route POST /api/users/signup
//@access Public 
router.post('/signup', signupUser)

//@desc Get user profile 
//@route POST /api/users/profile
//@access Private
router.get('/profile', requireAuth, getUserProfile)

//@desc Update user profile 
//@route PUT /api/users/profile
//@access Private
router.put('/profile', requireAuth, updateUserProfile)

router.put('/cart/qty', requireAuth, updateCartQty)
router.put('/cart/replace', requireAuth, replaceCart)
router.put('/cart', requireAuth, addItemToCart)
router.get('/cart', requireAuth, getCartItems)
router.delete('/cart', requireAuth, removeCartItem)
router.delete('/wholeCart', requireAuth, clearCart)


router.get('/:id', requireAuth, isAdmin, getUserById)
router.put('/:id', requireAuth, isAdmin, updateUser)
router.delete('/:id', requireAuth, isAdmin, deleteUser)



export default router