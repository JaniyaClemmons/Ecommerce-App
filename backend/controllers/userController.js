import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'


/*arg 1: payload on token {_id: _id} === {_id}, 
* arg2: Secret string from env variables (needs to remain hidden, not in code)
*arg3: options -- user logged in for 3 days 
*/
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
}

export const getCartItems = async (req, res) => {
    const { _id } = req.user
    try {
        const cartItems = await User.getCartItems(_id)
        res.status(200).json(cartItems);

    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }


}
export const replaceCart = async (req, res) => {
    const { _id } = req.user

    //console.log(req.body)
    try {
        const cartItems = await User.replaceCart(_id, req.body)
        res.status(200).json(cartItems);

    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }


}


export const addItemToCart = async (req, res) => {
    const { _id } = req.user;
    const { product, qty } = req.body


    try {
        //qty included in object 
        const cartItems = await User.addItemToCart(_id, product, qty)

        res.status(200).json(cartItems);


    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }
}

export const updateCartQty = async (req, res) => {
    const { _id } = req.user;
    const { product, qty } = req.body


    try {
        //qty included in object 
        const cart = await User.updateCartQty(_id, product, qty)

        res.status(200).json(cart);


    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }
}

export const removeCartItem = async (req, res) => {
    const { _id } = req.user;
    const { product } = req.body


    try {
        //qty included in object 
        const cart = await User.removeCartItem(_id, product)

        res.status(200).json(cart);


    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }
}
export const clearCart = async (req, res) => {
    const { _id } = req.user;



    try {
        //qty included in object 
        const cart = await User.clearCart(_id)

        res.status(200).json(cart);


    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }
}


export const getUserProfile = async (req, res) => {
    //res.json({mssg: "signup user"});
    //access body with req.body

    const { _id } = req.user;

    //Add doc to db
    try {

        //user has all model fields     
        const user = await User.getUserProfile(_id)
        const token = await createToken(_id)
        const userInfo = {
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            name: user.name,
            _id: user._id,
            cartItems: user.cartItems,
            shippingAddress: user.shippingAddress,
            token: token
        }

        //Send back a OK response and the email and new document 
        res.status(200).json(userInfo);
    } catch (error) {
        //Send error status and send json with the error msg
        res.status(404).json({ error: "User not found" });
    }
}

export const updateUserProfile = async (req, res) => {
    //res.json({mssg: "signup user"});
    //access body with req.body



    const { name, email, password } = req.body

    const { _id } = req.user

    //Add doc to db
    try {

        //user has all model fields     
        const user = await User.updateUserProfile(_id, name, email, password);
        console.log(user)


        //const updatedUser = await user.save()

        /*const token = await createToken(_id)*/
        const userInfo = {
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            name: user.name,
            _id: user._id,
            shippingAddress: user.shippingAddress


            //Does user keep same token?
        }

        //Send back a OK response with new user and token 
        res.status(200).json(userInfo);
    } catch (error) {
        //Send error status and send json with the error msg
        res.status(404).json({ error: error.message });
    }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find({})
    res.json(users)

})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.deleteOne()
        const users = await User.find({})
        res.status(200).json(users)
    } else {
        res.status(404).json({ error: 'User not found' })

    }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.status(200).json(user)
    } else {
        res.status(404).json({ error: 'User not found' })
        //throw new Error('User not found')
    }
})



// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
    try {
        const currentAdmin = await User.findById(req.user._id)
        const user = await User.findById(req.params.id)

        if (user && user === currentAdmin) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            //user.isAdmin = true

            const updatedUser = await user.save()

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            })
        }
        else if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.isAdmin = req.body.isAdmin

            const updatedUser = await user.save()

            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
            })
        }
    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: "User update failed" });
    }
})



export const signupUser = async (req, res) => {
    //res.json({mssg: "login user"});
    //create new user
    //access body with req.body - form body 
    const { name, email, password, isAdmin } = req.body;

    let emptyFields = [];

    if (!email) {
        emptyFields.push('email');
    }
    if (!name) {
        emptyFields.push('name');
    }
    if (!password) {
        emptyFields.push('password');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }

    //Add doc to db
    try {

        const user = await User.signup(name, email, password, isAdmin);
        //create toke 
        const token = createToken(user._id);
        const userInfo = {
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            name: user.name,
            _id: user._id
        }
        res.status(200).json({ ...userInfo, token });
    } catch (error) {
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }

}



export const loginUser = async (req, res) => {
    //res.json({mssg: "signup user"});
    //access body with req.body
    const { email, password } = req.body;
    console.log(email)
    console.log(password)

    let emptyFields = [];

    if (!email) {
        emptyFields.push('email');
    }
    if (!password) {
        emptyFields.push('password');
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }


    //Add doc to db
    try {

        //user has all model fields     
        const user = await User.login(email, password);
        const userInfo = {
            email: user.email,
            password: user.password,
            isAdmin: user.isAdmin,
            name: user.name,
            _id: user._id,
            cartItems: user.cartItems || [],
            shippingAddress: user.shippingAddress || {}
        }



        //create token with users id embedded
        const token = await createToken(userInfo._id);

        //Send back a OK response and the email and new document 
        res.status(200).json({ ...userInfo, token });
    } catch (error) {
        console.log(error);
        //Send error status and send json with the error msg
        res.status(400).json({ error: error.message });
    }
}


export default signupUser