const express = require("express");
const { auth } = require("../middleware/auth");
const { getAll } = require("../controllers/address.controller");
const { getAllProduct, createProduct, getOneProduct, editProduct, deleteProduct } = require("../controllers/product.controller");
const productRoutes= express.Router();

//auth
// Get all products
productRoutes.get("/", getAllProduct);

// Create a new product
productRoutes.post("/", createProduct);

// Get a single product by ID
productRoutes.get("/:id",getOneProduct );

// Update a product by ID
productRoutes.put("/:id",editProduct);

// Delete a product by ID
productRoutes.delete("/:id",deleteProduct );

module.exports = productRoutes;
