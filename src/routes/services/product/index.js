var express = require("express");
const Product = require("../../../models/Product");
var router = express.Router();
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");

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

module.exports = router;
