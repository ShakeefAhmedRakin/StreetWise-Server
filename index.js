const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iixzvov.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // COLLECTIONS
    const userCollection = client
      .db("StreetWiseDB")
      .collection("userCollection");

    // JWT TOKEN AUTH API
    app.post("/jwt", async (req, res) => {
      const uid = req.body;

      const token = jwt.sign(uid, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    // MIDDLEWARE
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "Unauthorized Access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Unauthorized Access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    const verifyAdmin = async (req, res, next) => {
      const uid = req.decoded.uid;
      const query = { uid: uid };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      next();
    };

    // ------------------------------------------------------------
    // ----------------------CUSTOMER APIS-------------------------
    // ------------------------------------------------------------

    // USER CREATION POST API
    app.post("/create-user", async (req, res) => {
      try {
        const userInfo = req.body;
        const userExists = await userCollection.findOne({ uid: userInfo.uid });

        if (!userExists) {
          const result = await userCollection.insertOne(userInfo);
          res.send(result);
        } else {
          res.send({ prevUser: true });
        }
      } catch (error) {
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // USER INFO UPDATE INFORMATION API
    app.put("/update-user-info", verifyToken, async (req, res) => {
      const { uid, type, data } = req.body;

      const query = {
        uid: uid,
      };

      if (type === "first") {
        const updatedInfo = {
          $set: {
            firstName: data,
          },
        };
        const result = await userCollection.updateOne(query, updatedInfo);
        res.send(result);
      }

      if (type === "last") {
        const updatedInfo = {
          $set: {
            lastName: data,
          },
        };
        const result = await userCollection.updateOne(query, updatedInfo);
        res.send(result);
      }

      if (type === "address") {
        const toBeUpdated = await userCollection.findOne(query);
        const updatedInfo = {
          $set: {
            address: [...toBeUpdated.address, data],
          },
        };
        const result = await userCollection.updateOne(query, updatedInfo);
        res.send(result);
      }

      if (type === "address-delete") {
        const toBeUpdated = await userCollection.findOne(query);
        const { index } = req.body;
        const newAddressArray = [...toBeUpdated.address];
        newAddressArray.splice(index, 1);
        const updatedInfo = {
          $set: {
            address: [...newAddressArray],
          },
        };

        const result = await userCollection.updateOne(query, updatedInfo);
        res.send(result);
      }
    });

    // USER INFO UPDATE LAST LOGGED API
    app.put("/update-last-logged", async (req, res) => {
      const { uid, time } = req.body;

      const query = {
        uid: uid,
      };
      const updatedInfo = {
        $set: {
          lastSignInTime: time,
        },
      };
      try {
        const result = await userCollection.updateOne(query, updatedInfo);
        res.send(result);
      } catch (error) {
        console.error("Error updating last logged time:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // USER INFO GET API
    app.get("/get-user/:uid", verifyToken, async (req, res) => {
      try {
        const uid = req.params.uid;
        const userInfo = await userCollection.findOne({ uid });

        if (userInfo) {
          res.send(userInfo);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // ---------------------------------------------------------
    // ----------------------ADMIN APIS-------------------------
    // ---------------------------------------------------------

    // USERS COUNT BASED ON FILTER AND SEARCH (COUNT) API
    app.get(
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

          const count = await userCollection.countDocuments(query);
          res.send({ count });
        } catch (error) {
          console.error("Error counting users:", error);
          res
            .status(500)
            .send({ error: "An error occurred while counting users" });
        }
      }
    );

    // USERS DATA BASED ON FILTER AND SEARCH API
    app.get("/manage/get-users", verifyToken, verifyAdmin, async (req, res) => {
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

      const result = await userCollection
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    // USERS UPDATE ROLE API
    app.put(
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
          const result = await userCollection.updateOne(query, updatedInfo);
          res.send(result);
        } catch (error) {
          res.status(500).send("Internal Server Error");
        }
      }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
