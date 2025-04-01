const express = require("express");
const addressRoutes = express.Router();
const { Address, addressValidator } = require("../models/address");
const { auth } = require("../middleware/auth");
const { getAll, getOne, create, editOne, deleteOne } = require("../controllers/address.controller");

//, auth
//Getting list of address
addressRoutes.get("/", getAll);

//Creating new Address
addressRoutes.post("/", create);

//Get a single address
addressRoutes.get("/:id",getOne);

//Editing address
addressRoutes.put("/:id", editOne );

//Deleting address
addressRoutes.delete("/:id",deleteOne);
module.exports = addressRoutes;
