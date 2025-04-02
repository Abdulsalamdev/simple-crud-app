const { Product, productValidator } = require("../models/product");

const getAll = async (query) => {
  const filters = {};
  if (query.name) {
    filters.name = new RegExp(query.name, "i");
  }
  if (query.price) {
    filters.price = { $gte: query.price };
  }
  if (query.category) {
    filters.category = new RegExp(query.category, "i");
  }
  const product = await Product.find(filters).sort("name");

  return product;
};

const create = async (data) => {
  const product = new Product({
    name: data.name,
    price: data.price,
    description: data.description,
    category: data.category,
    stock: data.stock,
  });

  await product.save();

  return product;
};
const getOneProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
const edit = async (id, body) => {
  const product = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
module.exports = {
  getAll,
  create,
  getOneProduct,
  edit,
  deleteProduct,
};
