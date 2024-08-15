import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import validator from 'validator'

//const Schema = mongoose.Schema;

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        //creates relationship with different model 
        ref: 'Product', required: true
    },
    qty: { type: Number, required: true }
})
//structure of data
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true //if someone else tries to use email, mongoose wont save

    },
    password: {
        type: String,
        required: true,
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        //creates relationship with different model 
        ref: 'Address'
    },
    cartItems:
        [cartItemSchema]
    ,
    resetToken: { type: String },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }

}, { timestamps: true }); //when we add/update a new doc, it adds create stamp


//static signup method for User
//cant use error function with "this" keyword 
userSchema.statics.signup = async function (name, email, password, isAdmin) {

    //email valid
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid ')
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough')
    }

    //check if email already exists - even though we have unique so we can do custom error
    //this refers to model (we dont have User yet until export line)
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)

    //hash salt with password
    const hash = await bcrypt.hash(password, salt)

    //store user and hashed password 
    const user = await this.create({ name, email, isAdmin, password: hash })

    return user
}

userSchema.statics.login = async function (email, password) {

    const user = await this.findOne({ email })

    if (!user) {
        //check password matches
        throw Error("incorrect email")
    }
    //plain text, hashed version on user document in db - returns T/F  
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        console.log("should throw wrong password")
        throw Error('Incorrect password')
    }
    return user
}

userSchema.statics.getUserProfile = async function (_id) {

    const user = await this.findById({ _id })

    return user
}
userSchema.statics.updateUserProfile = async function (_id, name, email, password) {

    const user = await this.findById({ _id })


    //plain text, hashed version on user document in db - returns T/F  
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        throw Error('Incorrect password')
    }

    if (user) {
        user.email = email || user.email
        //if (password) { user.password = password || user.password }
        user.name = name || user.name

    }
    //store user and hashed password 
    await user.save()

    const updatedUser = await this.findById({ _id })


    return updatedUser
}
//cart item with qty as field 
/*product: data._id,
                    name: data.name,
                    image: data.image,
                    price: data.price,
                    countInStock: data.countInStock,
                    qty: qty */
userSchema.statics.addItemToCart = async function (_id, product, qty) {
    //const cart = this.getCartItems(_id)

    console.log(product)
    console.log(qty)
    const user = await this.findById({ _id })

    const oldCart = user.cartItems
    //push {productId, qty}
    //check if product id already in cart
    const cartItem = oldCart.find(item =>

        item.product.toString() === product
    )

    if (cartItem) {
        const newCart = oldCart.map(item => item.product.toString() === product ? { ...item, qty: item.qty + qty } : item)
        user.cartItems = newCart
        user.save()
        //return user.cartItems
    } else {
        //console.log(`before: ${user.cartItems}`)
        //cart item push and add to db
        user.cartItems.push({ product, qty })
        user.save()
        //return user.cartItems

    }
    await user.populate({
        path: 'cartItems.product'
    })
    const cartItems = user.cartItems.map(item => {
        return {
            product: item.product._id,
            countInStock: item.product.countInStock,
            image: item.product.image,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty
        }
    })
    console.log("backend: ", cartItems)
    return cartItems

}
userSchema.statics.getCartItems = async function (_id) {
    //array of cartItem objects [{_cartItem_id, product: {product object}, qty}]
    const user = await this.findById({ _id }).populate({
        path: 'cartItems.product'
    })
    //const user = await this.findById({ _id })
    //console.log(user.cartItems)

    const cartItems = user.cartItems.map(item => {
        return {
            product: item.product._id,
            countInStock: item.product.countInStock,
            image: item.product.image,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty
        }
    })
    
    return cartItems

}
userSchema.statics.replaceCart = async function (_id, cart) {
    //array of cartItem objects [{_cartItem_id, product: {product object}, qty}]
    const user = await this.findById({ _id })

    user.cartItems = cart
    user.save()
    await user.populate({
        path: 'cartItems.product'
    })

    //const user = await this.findById({ _id })
    // console.log(user.cartItems)

    const cartItems = user.cartItems.map(item => {
        return {
            product: item.product._id,
            countInStock: item.product.countInStock,
            image: item.product.image,
            name: item.product.name,
            price: item.product.price,
            qty: item.qty
        }
    })
    return cartItems

}
userSchema.statics.updateCartQty = async function (_id, product, qty) {
    //const cart = this.getCartItems(_id)

    /*console.log(product)
    console.log(qty)*/
    const user = await this.findById({ _id })

    const oldCart = user.cartItems
    //push {productId, qty}
    //check if product id already in cart
    const cartItem = oldCart.find(item =>

        item.product.toString() === product
    )

    if (cartItem) {
        const newCart = oldCart.map(item => item.product.toString() === product ? { ...item, qty: qty } : item)
        user.cartItems = newCart
        user.save()
        await user.populate({
            path: 'cartItems.product'
        })
        const cartItems = user.cartItems.map(item => {
            return {
                product: item.product._id,
                countInStock: item.product.countInStock,
                image: item.product.image,
                name: item.product.name,
                price: item.product.price,
                qty: item.qty
            }
        })
        return cartItems
    }

}
userSchema.statics.removeCartItem = async function (_id, product) {

    const user = await this.findById({ _id })

    const oldCart = user.cartItems
    //push {productId, qty}
    //check if product id already in cart
    const cartItem = oldCart.find(item =>

        item.product.toString() === product
    )

    if (cartItem) {
        const newCart = oldCart.filter(item => item.product.toString() !== product)
        user.cartItems = newCart
        user.save()
        await user.populate({
            path: 'cartItems.product'
        })
        const cartItems = user.cartItems.map(item => {
            return {
                product: item.product._id,
                countInStock: item.product.countInStock,
                image: item.product.image,
                name: item.product.name,
                price: item.product.price,
                qty: item.qty
            }
        })
        return cartItems
    }

}
userSchema.statics.clearCart = async function (_id) {

    const user = await this.findById({ _id })

    user.cartItems = []
    user.save()
    return user.cartItems


}

//model applys schema and creates a pluralized collection 
export default mongoose.model('User', userSchema);

/* const User = mongoose.model('User', userSchema);
module.exports = User */ 