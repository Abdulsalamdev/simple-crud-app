const express = require("express");
const { auth } = require("../middleware/auth");
const { getAll } = require("../controllers/address.controller");
const { getAllProduct, createProduct, getOneProduct, editProduct, deleteProduct } = require("../controllers/product.controller");
const productRoutes= express.Router();

//auth
// Get all products
productRoutes.get("/", auth,getAllProduct);

// Create a new product
productRoutes.post("/",auth, createProduct);

// Get a single product by ID
productRoutes.get("/:id",auth,getOneProduct );

// Update a product by ID
productRoutes.put("/:id",auth,editProduct);

// Delete a product by ID
productRoutes.delete("/:id",auth,deleteProduct );

module.exports = productRoutes;
