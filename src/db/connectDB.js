const mongoose = require("mongoose");
const config = require("../config/default");

const getConnectionString = () => {
  let connectionURI;
  if (config.NODE_ENV === "development") {
    connectionURI = config.DATABASE_URI_LOCAL;
    connectionURI = connectionURI.replace("<username>", config.DB_USER);
    connectionURI = connectionURI.replace("<password>", config.DB_PASS);
  } else {
    connectionURI = config.DATABASE_URI_PROD;
  }
  return connectionURI;
};

const connectDB = async () => {
  console.log("Connecting to StreetWiseDB...");
  const URI = getConnectionString();

  await mongoose.connect(URI, { dbName: config.DB_NAME });
  console.log("Connected to StreetWiseDB Successfully");
};

module.exports = connectDB;
