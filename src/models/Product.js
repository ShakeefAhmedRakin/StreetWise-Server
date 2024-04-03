const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "",
  },
  description: {
    type: String,
    required: true,
    default: "",
  },
  sizes: {
    type: Array,
    required: true,
    default: [],
  },
  gender: {
    type: String,
    required: true,
    default: "",
  },
  color: {
    type: String,
    required: true,
    default: "",
  },
  price: {
    type: String,
    required: true,
    default: "",
  },
  category: {
    type: String,
    required: true,
    default: "",
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    required: true,
    default: 0,
  },
  imageURLs: {
    type: Array,
    required: true,
    default: [],
  },
  featured: {
    type: Boolean,
    required: true,
    default: false,
  },
  draft: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Category = model("Product", ProductSchema, "productCollection");

module.exports = Category;
