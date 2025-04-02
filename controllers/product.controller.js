const { Product, productValidator } = require("../models/product");
const productService = require("../services/product.service");
const getAllProduct = async (req, res) => {
  try {
    const product = await productService.getAll(req.query);

    res.status(200).send({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const { error } = productValidator(req.body);
  if (error) return res.status(400).send({ massage: error.details[0].message });
  const { body: data } = req;

  try {
    const product = await productService.create(data);
    res.status(201).send({
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.getOneProduct(id);
    res.status(200).send({
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const editProduct = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;
  try {
    const product = await productService.edit(id, body);
    res.status(200).send({
      message: "Product edited Successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productService.deleteProduct(id);
    res.status(200).send({ message: "Product deleted" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllProduct,
  createProduct,
  getOneProduct,
  editProduct,
  deleteProduct,
};
