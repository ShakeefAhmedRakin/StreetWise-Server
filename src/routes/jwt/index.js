var express = require("express");
const { createToken } = require("../../api/auth/controllers/index");
var router = express.Router();

router.post("/jwt", createToken);

module.exports = router;
