const express = require("express")
const addressRoutes = require("../routes/address")
const indexRoutes = express.Router()

indexRoutes.use("/address",addressRoutes)

module.exports = indexRoutes