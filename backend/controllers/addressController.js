/**
 * Functions to query db 
 */
import Address from "../models/addressModel.js"
import User from '../models/userModel.js'
import Order from "../models/orderModel.js"
import mongoose from "mongoose"
import asyncHandler from "express-async-handler"


// @desc       Register a new address
// @route      POST /api/address
// @access     Private
export const createShippingAddress = asyncHandler(async (req, res) => {
    const { fullName, address, city, postalCode, country, state } = req.body;
    const { _id } = req.user
    console.log("came to create");


    try {
        const shippingAddress = await Address.create({
            fullName,
            address,
            city,
            state,
            country,
            postalCode
        })
        console.log(shippingAddress);


        await User.findByIdAndUpdate({ _id }, { shippingAddress })
        //const user = findById({_id})

        res.status(200).json(shippingAddress)
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}
)

// // @desc       Get user address
// // @route      GET /api/address
// // @access     Private
const getShippingAddress = async (req, res) => {

    const { _id } = req.user
    try {
        const user = await User.findById({ _id }).populate('shippingAddress');

        (user.shippingAddress) ? res.status(200).json(user.shippingAddress) : res.status(200).json({})

    } catch (error) {

        res.status(400).json({ error: error.message })

    }

}

// // @desc       Update Shipping Address
// // @route      PUT /api/address
// // @access     Private
export const updateShippingAddress = async (req, res) => {
    console.log(req.body)
    const { fullName, address, city, state, postalCode, country } = req.body;
    const { _id } = req.user


    try {

        const user = await User.findById({ _id })


        const userAddress = user.shippingAddress

        const oldAddress = await Address.findById({ _id: userAddress })


        if (oldAddress) {
            oldAddress.fullName = fullName || oldAddress.fullName
            oldAddress.address = address || oldAddress.address
            oldAddress.city = city || oldAddress.city
            oldAddress.state = state || oldAddress.state
            oldAddress.postalCode = postalCode || oldAddress.postalCode
            oldAddress.country = country || oldAddress.country

        }
        //store user and hashed password 
        await oldAddress.save()

        res.status(200).json(oldAddress)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }



}

export default getShippingAddress