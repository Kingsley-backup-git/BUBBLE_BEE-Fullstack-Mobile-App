var validator = require('validator');
const UserCollection = require("../../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
async function creatToken(id) {
    return  await jwt.sign({
    _id : id
},process.env.JWT_SECRET, {expiresIn : "1h"})
}


async function SignUp(req, res) {
    const { email, password } = req.body
    
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        
        if (!validator.isEmail(email)) {
             return res.status(400).json({ message: "Must be a valid email" })
        }

            if (!validator.isStrongPassword(password)) {
             return res.status(400).json({ message: "Password is not strong enough" })
            }
        
        const checkUser = await UserCollection.findOne({ email })
        if (checkUser) {
                  return res.status(400).json({ message: "User already Exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await UserCollection({
            email,
            password : hashedPassword
        })
        const token = await creatToken(newUser._id)
        await newUser.save()
        return res.status(200).json({
            data: {
                newUser,
                accessToken : token
         },})
    } catch (err) {
        console.log(err)
 return res.status(500).json({ message: "Internal server error"})
    }

}


async function SignIn(req, res) {
    const { email, password } = req.body
    
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        
        if (!validator.isEmail(email)) {
             return res.status(400).json({ message: "Must be a valid email" })
        }

            if (!validator.isStrongPassword(password)) {
             return res.status(400).json({ message: "Password is not strong enough" })
            }
        
        const user = await UserCollection.findOne({ email })
        const comparePassword = await bcrypt.compare(password, user?.password)


        if (!user) {
                  return res.status(400).json({ message: "Account not found"})
        }
        if (!comparePassword) {
                return res.status(400).json({ message: "Incorrect Password"})
 }
        
            const token = await creatToken(user._id)
    
        return res.status(200).json({
            data: {
                user,
                accessToken : token
         }})
    } catch (err) {
        console.log(err)
 return res.status(500).json({ message: "Internal server error"})
    }

}

module.exports = {
    SignUp,
    SignIn
}