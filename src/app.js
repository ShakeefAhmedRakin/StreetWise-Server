const express = require("express");
const applyMiddleware = require("./middlewares/applyMiddleware");
const connectDB = require("./db/connectDB");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const authRoute = require("./routes/jwt/index");
const userRoutes = require("./routes/services/users/index");
const categoryRoutes = require("./routes/services/category/index");
const productRoutes = require("./routes/services/product/index");

applyMiddleware(app);
app.use(authRoute);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(productRoutes);

app.get("/health", (req, res) => {
  res.send("StreetWiseClothing Server is running");
});

// MEANINGFUL MESSAGE FOR WRONG ROUTE
app.all("*", (req, res, next) => {
  const error = new Error(`The requested url is invalid : ${req.url}`);
  error.status = 404;
  next(error);
});

// GLOBAL MIDDLEWARE FOR HANDLING ERRORS ( THIS STOPS SERVER FROM CRASHING WHEN ERRORS OCCURRED )
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const main = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log("Server listening on port", port);
  });
};

main();
