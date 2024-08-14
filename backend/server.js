import path from 'path'
import dotenv from "dotenv"
import express from 'express'
import mongoose from 'mongoose'
//import morgan from 'morgan'
import { ServerApiVersion } from 'mongodb'
import productRoutes from "./routes/products.js"
import userRoutes from "./routes/users.js"
import addressRoutes from "./routes/address.js"
import orderRoutes from "./routes/orders.js"
import uploadRoutes from "./routes/uploadRoutes.js"

dotenv.config()

//express app
const app = express()


/*if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}*/

//global middleware - LOGGER (called between every request between client and server)
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})
//expects json data {"Name": "Pikachu", "Type": "Banana"}
//must be placed before routes 
app.use(express.json());

//register routes
app.use('/api/products', productRoutes)

app.use('/api/users', userRoutes)
app.use('/api/address', addressRoutes)

app.use('/api/orders', orderRoutes)

app.use('/api/upload', uploadRoutes)

//Returns client id from env file
app.get('/api/config/paypal', (req, res) => res.json(process.env.PAYPAL_CLIENT_ID))



const __dirname = path.resolve()
console.log(__dirname)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))




//Only fields specified in model will be saved to db
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1

})
    // .then() of a promise obj says to wait until completed, then do something
    .then(() => {
        //listen for request after connected to db
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Connected to db and server running in ${process.env.NODE_ENV} and listening on ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })

