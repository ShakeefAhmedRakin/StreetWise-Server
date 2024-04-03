var express = require("express");
const Product = require("../../../models/Product");
var router = express.Router();
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");

// PRODUCT ADD API
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

module.exports = router;
