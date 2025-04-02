const { Product, productValidator } = require("../models/product");

const getAllProduct = async (req, res) => {
    try {
      const filters = {};
      if (req.query.name) {
        filters.name = new RegExp(req.query.name, "i");
      }
      if (req.query.price) {
        filters.price = { $gte: req.query.price };
      }
      if (req.query.category) {
        filters.category = new RegExp(req.query.category, "i");
      }
      const products = await Product.find(filters).sort("name");
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

const createProduct = async (req, res) => {
    const { error } = productValidator(req.body);
    if (error) return res.status(400).send({ massage: error.details[0].message });
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
  }

  const getOneProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send({ message: "Product not found" });
  
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
const editProduct =  async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).send({ message: "Product not found" });

    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
  
      if (!product) return res.status(404).send({ message: "Product not found" });
  
      res.status(200).send({ message: "Product deleted" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }


  module.exports = {
    getAllProduct,
    createProduct,
    getOneProduct,
    editProduct,
    deleteProduct
  }