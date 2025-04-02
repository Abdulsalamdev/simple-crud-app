const express = require("express")
const addressRoutes = require("../routes/address")
const productRoutes = require("../routes/products")
const indexRoutes = express.Router()

indexRoutes.use("/address",addressRoutes)
indexRoutes.use("/product", productRoutes)
module.exports = indexRoutes