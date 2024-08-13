const express = require("express");
const { Product, productValidator } = require("../model/product");
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort("name");
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Create a new product
router.post("/", async (req, res) => {
  const { error } = productValidator(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, price, description, category, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send({ message: "Product not found" });

    res.status(200).send(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid ID format");
    }
    res.status(500).send("Server Error");
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).send({ message: "Product not found" });

    res.status(200).send(product);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid ID format");
    }
    res.status(500).send("Server Error");
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).send({ message: "Product not found" });

    res.status(200).send({ message: "Product deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send("Invalid ID format");
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
