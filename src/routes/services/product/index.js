var express = require("express");
const Product = require("../../../models/Product");
var router = express.Router();
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");
const mongoose = require("mongoose");

// PRODUCT ADD API ( ADMIN )
router.post(
  "/manage/add-product",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { data } = req.body;
    const result = await Product.create(data);
    res.send(result);
  }
);

// SINGLE PRODUCT GET API ( ADMIN )
router.get(
  "/manage/get-product",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const id = req.query.id;

    const result = await Product.findById(id);
    res.send(result);
  }
);

// SINGLE PRODUCT UPDATE API ( ADMIN )
router.put(
  "/manage/update-product",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const { id } = req.body;
      const { data } = req.body;

      const updatedResult = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updatedResult) {
        return res.status(404).json({ message: "Data not found" });
      }

      res.json(updatedResult);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// PRODUCT GET API ( ADMIN )
router.get(
  "/manage/get-products",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    let query = {};
    if (req.query?.filter) {
      query.draft = req.query.filter;
    }

    if (req.query?.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      query.$or = [
        { name: searchRegex },
        { color: searchRegex },
        { gender: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ];
    }

    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    try {
      const result = await Product.find(query)
        .skip(page * size)
        .limit(size);
      res.send(result);
    } catch (error) {
      console.error("Error retrieving users:", error);
      res
        .status(500)
        .send({ error: "An error occurred while retrieving users" });
    }
  }
);

// PRODUCT GET COUNT API ( ADMIN)
router.get(
  "/manage/get-products/count",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      let query = {};

      if (req.query?.filter) {
        query.draft = req.query.filter;
      }

      if (req.query?.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        query.$or = [
          { name: searchRegex },
          { color: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
        ];
      }

      const count = await Product.countDocuments(query);
      res.send({ count });
    } catch (error) {
      console.error("Error counting products:", error);
      res
        .status(500)
        .send({ error: "An error occurred while counting products" });
    }
  }
);

// PRODUCT GET API ( PUBLIC )
router.get("/public/get-products/featured", async (req, res) => {
  let query = { draft: false, featured: true };

  if (req.query?.filter) {
    query.draft = req.query.filter === "true"; // Convert filter to boolean
  }

  if (req.query?.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    query.$or = [
      { name: searchRegex },
      { color: searchRegex },
      { gender: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
    ];
  }

  try {
    const result = await Product.find(query).select(
      "-draft -featured -added -lastModified -orders -__v"
    );
    res.send(result);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res
      .status(500)
      .send({ error: "An error occurred while retrieving products" });
  }
});

// PRODUCT GET DETAILS API ( PUBLIC )
router.get("/public/get-product-details/:id", async (req, res) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).send({ error: "Invalid product ID" });
  }

  try {
    const product = await Product.findOne({
      _id: new mongoose.Types.ObjectId(productId),
      draft: false,
    }).select("-draft -featured -added -lastModified -orders -__v");

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send({
      error: `An error occurred while retrieving the product details for ${productId}`,
    });
  }
});

module.exports = router;
