require("dotenv").config();

const config = {
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  DATABASE_URI_LOCAL: process.env.DATABASE_URI_LOCAL,
  DATABASE_URI_PROD: process.env.DATABASE_URI_PROD,
  NODE_ENV: process.env.NODE_ENV,
  DB_NAME: process.env.DB_NAME,
};

module.exports = config;
