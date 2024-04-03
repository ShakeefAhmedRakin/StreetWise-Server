var express = require("express");
const Category = require("../../../models/Category");
var router = express.Router();
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");

// CATEGORIES GET API
router.get("/manage/get-categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// CATEGORY ADD API
router.post(
  "/manage/add-category",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { category } = req.body;
      const existingCategory = await Category.findOne({ category });
      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }
      await Category.create({ category });
      res.status(200).json({ message: "Category added successfully" });
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// CATEGORY DELETE API
router.delete(
  "/manage/delete-category/:id",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const id = req.params.id;
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
