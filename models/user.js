const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
            trim: true,
        validate: {
            validator: (value) =>  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message : "Email must be a valid email"
        }
    },
    password: {
          type: String,
        required: true,
        minLength: [8, "password must be greater than 8 digits"],
        trim: true,
       validate: {
    validator: (value) =>
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(value),
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  }
    }
},{timestamps:true})

module.exports = mongoose.model("UserCollection", UserSchema)