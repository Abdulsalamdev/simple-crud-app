const express = require("express")
const indexRoutes = express.Router()
const addressRoutes = require("../routes/address")
const productRoutes = require("../routes/products")
const userroutes = require("../routes/users")



indexRoutes.use("/address",addressRoutes)
indexRoutes.use("/product", productRoutes)
indexRoutes.use("/", userroutes)


module.exports = indexRoutes