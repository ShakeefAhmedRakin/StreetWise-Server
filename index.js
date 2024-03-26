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

    app.get("/test", verifyToken, verifyAdmin, async (req, res) => {
      res.send("working");
    });

    // ----------------------APIS-------------------------

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

    // ---------------------------------------------------
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
