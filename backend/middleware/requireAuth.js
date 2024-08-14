import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

//next is invoked to move onto the next function/task 
const requireAuth = async (req, res, next) => {
    //verify user auth- when we send req we send auth prop 
    const { authorization } = req.headers

    //If auth has a value 
    if (!authorization) {
        return res.status(401).json({ error: "Authorization token required" })
    }

    //token looks like: 'Bearer dghsgjdhjhd.25286942.ahkshsla'
    //Split string on space
    const token = authorization.split(" ")[1];

    //verify token not tampered with 
    try {
        //jwt gives us back the id of the item 
        const { _id } = jwt.verify(token, process.env.SECRET);

        //gives req a user property - finds the document by id and only gives us its id 
        req.user = await User.findOne({ _id }).select('_id isAdmin');
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ error: 'Request is not authorized' });
    }

}

export default requireAuth