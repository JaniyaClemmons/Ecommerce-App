//scrpt to bring in data

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import { ServerApiVersion } from 'mongodb'

dotenv.config()

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1

})


const importData = async () => {
    //delete all from db
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()

        const createdUsers = await User.insertMany(users)
        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser }
        })

        await Product.insertMany(sampleProducts)

        console.log('Data Imported!')
        process.exit()

    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}

const destroyData = async () => {
    //delete all from db
    try {
        await Order.deleteMany()
        await Product.deleteMany()
        await User.deleteMany()


        console.log('Data Destroyed!')
        process.exit()

    } catch (error) {
        console.error(`${error}`)
        process.exit(1)
    }
}
//to run script its backend/seeder , w -d flag after we will call destroy
//we add a script to package.json to run this 
process.argv[2] === '-d' ? destroyData() : importData()