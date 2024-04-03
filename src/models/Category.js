const { Schema, model } = require("mongoose");

const CategoryScheme = new Schema({
  category: {
    type: String,
    required: true,
  },
});

const Category = model("Category", CategoryScheme, "categoryCollection");

module.exports = Category;
