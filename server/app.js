const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB, getDb } = require("./db");
const { generateAccessToken, compare, authenticateToken } = require("./auth");

app.use(express.json());
app.use(cors());

//port where sever is running
const PORT = 3000;

//connecting to database
connectDB();

//register a new user
app.post("/auth/register", async (req, res) => {
  try {
    const db = getDb();
    const data = {
      _id: "id" + new Date().getMilliseconds(),
      email: req.body.email,
      password: req.body.password,
    };

    //check if user already exists
    const existingUser = await db
      .collection("users")
      .findOne({ email: data.email });
    if (existingUser) {
      //conflict - req conflicts with the current state of server.
      return res.status(409).json({ message: "user already exists" });
    }

    //insert user into database
    await db.collection("users").insertOne(data);

    //response with success
    //201 - created - request sucess, new resource created
    return res
      .status(201)
      .json({
        message: "User created",
        payload: { _id: data._id, email: data.email },
      });
  } catch (err) {
    console.log(err.message);
    //internal server error - server does not know how to handle the error
    return res.status(500).json({ message: "Server error" });
  }
});

//login user after checking user exists
app.post("/auth/login", async (req, res) => {
  try {
    const db = getDb();
    const data = {
      email: req.body.email,
      password: req.body.password,
    };

    //check if user exists
    const user = await db.collection("users").findOne({ email: data.email });
    if (!user) {
      //not found - server cannot find requested resource
      return res.status(404).json({ message: "User not found" });
    }

    //check if password matches
    const isMatch = compare(data.password, user.password);
    if (!isMatch) {
      //unauthorized access
      return res.status(401).json({ message: "Wrong password" });
    }

    const accessToken = generateAccessToken(user);
    //tokens are generated and response is sent
    return res.status(200).json({
      accessToken,
      payload: user.email,
      expiresAt: "15s", // 15days
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error" }); //internal server error
  }
});

app.get("/private/home", authenticateToken, (req, res) => {
  res.json({
    message: "this is protected route",
    user: req.user,
  });
});

app.listen(PORT, () => console.log(`server running at portno ${PORT}`));
