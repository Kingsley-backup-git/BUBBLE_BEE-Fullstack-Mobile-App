const express = require("express")
const mongoose = require("mongoose")
const UserRoute = require("./routes/user.js")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use("/api", UserRoute)

mongoose.connect(process.env.MONGODB_URL).then(() => {
    app.listen(process.env.PORT_NUMBER, () => {
    console.log("listening on port 4090")
})
}).catch((err) => {
    console.log("Could not connect to Mongoose")
    console.log(err)
})
