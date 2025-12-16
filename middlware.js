const jwt = require('jsonwebtoken');
const UserCollection = require("./models/user")
async function requireAuth(req, res, next) {
    const { authorization } = req.header
    
    if (!authorization || !authorization.startWith("Bearer")) {
        return res.status(401).json({message: "Unauthorized"})
    }
    const token = authorization.split(" ")[1]
    if (!token) {
           return res.status(401).json({message: "No token found"})
    }

    try {
        const decodedToken = await jwt.verify(token)
        
        if (!decodedToken) {
             return res.status(401).json({message: "Invalid Token"})
        }

        const user = await UserCollection.findOne({_id}).select("_id")
        if (!user) {
       return res.status(401).json({ message: "User not found" });
}
        req.user = user
        
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Unauthorized" })
        next()
    }
}

module.exports = requireAuth