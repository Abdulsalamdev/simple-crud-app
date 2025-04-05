const express = require("express");
const addressRoutes = express.Router();
const { auth } = require("../middleware/auth");
const { getAll, getOne, create, editOne, deleteAddress } = require("../controllers/address.controller");

//, auth
//Getting list of address
addressRoutes.get("/", auth,getAll);

//Creating new Address
addressRoutes.post("/", auth,create);

//Get a single address
addressRoutes.get("/:id",auth,getOne);

//Editing address
addressRoutes.put("/:id",auth, editOne );

//Deleting address
addressRoutes.delete("/:id", auth,deleteAddress);
module.exports = addressRoutes;
