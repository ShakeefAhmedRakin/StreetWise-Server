var express = require("express");
const User = require("../../../models/User");
var router = express.Router();
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");

// USER CREATION POST API
router.post("/create-user", async (req, res) => {
  try {
    const userInfo = req.body;
    const userExists = await User.findOne({ uid: userInfo.uid });

    if (!userExists) {
      const newUser = await User.create(userInfo);
      console.log(newUser);
      res.send(newUser);
    } else {
      res.send({ prevUser: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// USER INFO UPDATE LAST LOGGED API
router.put("/update-last-logged", async (req, res) => {
  const { uid } = req.body;
  const query = {
    uid: uid,
  };
  const updatedInfo = {
    $set: {
      lastSignInTime: Date.now(),
    },
  };
  try {
    const result = await User.updateOne(query, updatedInfo);
    res.send(result);
  } catch (error) {
    console.error("Error updating last logged time:", error);
    res.status(500).send("Internal Server Error");
  }
});

// USER INFO UPDATE INFORMATION API
router.put("/update-user-info", verifyToken, async (req, res) => {
  const { uid, type, data } = req.body;

  const query = {
    uid: uid,
  };

  try {
    if (type === "first") {
      const result = await User.updateOne(query, { $set: { firstName: data } });
      res.send(result);
    }

    if (type === "last") {
      const result = await User.updateOne(query, { $set: { lastName: data } });
      res.send(result);
    }

    if (type === "address") {
      const toBeUpdated = await User.findOne(query);
      if (!toBeUpdated) {
        throw new Error("User not found");
      }
      toBeUpdated.address.push(data);
      const result = await toBeUpdated.save();
      res.send(result);
    }

    if (type === "address-delete") {
      const toBeUpdated = await User.findOne(query);

      if (!toBeUpdated) {
        throw new Error("User not found");
      }
      const { index } = req.body;
      toBeUpdated.address.splice(index, 1);
      const result = await toBeUpdated.save();
      res.send(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// USER INFO GET API
router.get("/get-user/:uid", verifyToken, async (req, res) => {
  try {
    const uid = req.params.uid;
    const userInfo = await User.findOne({ uid });

    if (userInfo) {
      res.send(userInfo);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error retrieving user information:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// USERS COUNT BASED ON FILTER AND SEARCH (COUNT) API
router.get(
  "/manage/get-users/count",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      let query = {};

      if (req.query?.filter) {
        query.role = req.query.filter;
      }

      if (req.query?.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        query.$or = [{ firstName: searchRegex }, { lastName: searchRegex }];
      }

      const count = await User.countDocuments(query);
      res.send({ count });
    } catch (error) {
      console.error("Error counting users:", error);
      res.status(500).send({ error: "An error occurred while counting users" });
    }
  }
);

// USERS DATA BASED ON FILTER AND SEARCH API
router.get("/manage/get-users", verifyToken, verifyAdmin, async (req, res) => {
  let query = {};
  if (req.query?.filter) {
    query.role = req.query.filter;
  }

  if (req.query?.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    query.$or = [{ firstName: searchRegex }, { lastName: searchRegex }];
  }

  const page = parseInt(req.query.page);
  const size = parseInt(req.query.size);

  try {
    const result = await User.find(query)
      .skip(page * size)
      .limit(size);
    res.send(result);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).send({ error: "An error occurred while retrieving users" });
  }
});

// USERS UPDATE ROLE API
router.put(
  "/manage/change-user-role",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { uid, role } = req.body;

    const query = {
      uid: uid,
    };

    const updatedInfo = {
      $set: {
        role: role,
      },
    };

    try {
      const result = await User.updateOne(query, updatedInfo);
      res.send(result);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
