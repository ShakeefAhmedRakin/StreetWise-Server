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
    default: "0",
  },
  cost: {
    type: String,
    required: true,
    default: "0",
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
  added: {
    type: Number,
    default: Date.now,
  },
  lastModified: {
    type: Number,
    default: Date.now,
  },
  orders: [
    {
      orderId: {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Product = model("Product", ProductSchema, "productCollection");

module.exports = Product;
