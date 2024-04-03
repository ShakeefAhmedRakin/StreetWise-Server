const User = require("../models/User");

const verifyAdmin = async (req, res, next) => {
  const uid = req.decoded.uid;
  const query = { uid: uid };
  const user = await User.findOne(query);
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res.status(403).send({ message: "Forbidden Access" });
  }
  next();
};

module.exports = verifyAdmin;
