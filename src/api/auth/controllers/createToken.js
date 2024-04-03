const generateToken = require("../../../utils/generateToken");

const createToken = async (req, res) => {
  const uid = req.body;

  const token = generateToken(uid);
  res.send({ token });
};

module.exports = createToken;
