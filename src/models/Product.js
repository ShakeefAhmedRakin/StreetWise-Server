const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
  name: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  sizes: {
    type: Array,
    required: true,
    default: [],
  },
  gender: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  price: {
    type: String,
    required: true,
    default: "",
  },
  category: {
    type: String,
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
