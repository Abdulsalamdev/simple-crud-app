const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    minlength: [3, "Product name must be at least 3 characters long"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  description: String,
  category: {
    type: String,
    enum: ["Electronics", "Books", "Clothing", "Other"],
    default: "Other",
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative"],
  },
});

const Product = mongoose.model("Product", productSchema);
const productValidator = (product) => {
  const schema = Joi.object({
    name: Joi.string().max(24).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().optional(),
    category: Joi.string()
      .valid("Electronics", "Books", "Clothing", "Other")
      .default("Other"),
    stock: Joi.number().integer().min(0).default(0),
  });
  return schema.validate(product);
};
module.exports = { Product, productValidator };
