const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    required: true,
    default: "customer",
  },
  address: {
    type: Array,
    required: true,
    default: [],
  },
  orders: {
    type: Array,
    required: true,
    default: [],
  },
  phone: {
    type: String,
    default: "",
  },
  creationTime: {
    type: Number,
    required: true,
    default: Date.now,
  },
  lastSignInTime: {
    type: Number,
    required: true,
    default: Date.now,
  },
});

const User = model("User", UserSchema, "userCollection");

module.exports = User;
