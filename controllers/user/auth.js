var validator = require('validator');
const UserCollection = require("../../models/user")
const bcrypt = require("bcryptjs")
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
        
        await newUser.save()
         return res.status(200).json({ data: newUser})
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
        
       
    
         return res.status(200).json({ data: user})
    } catch (err) {
        console.log(err)
 return res.status(500).json({ message: "Internal server error"})
    }

}

module.exports = {
    SignUp,
    SignIn
}