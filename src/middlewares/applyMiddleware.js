const cors = require("cors");
const express = require("express");

const applyMiddleware = (app) => {
  app.use(cors());
  app.use(express.json());
};

module.exports = applyMiddleware;
