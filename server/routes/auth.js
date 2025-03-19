const express = require("express");
const router = express.Router();

const { getDb } = require("../db");
const {
  generateAccessToken,
  compare,
  authenticateToken,
} = require("../jwt.auth");

//register a new user
router.post("/register", async (req, res) => {
  try {
    const db = getDb();
    const data = {
      _id: "id" + Date.now(),
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    //check if user already exists
    const existingUser = await db
      .collection("users")
      .findOne({ email: data.email });
    if (existingUser) {
      //conflict - req conflicts with the current state of server.
      return res.status(409).json({ message: "user already exists." });
    }

    //insert user into database
    await db.collection("users").insertOne(data);

    //response with success
    //201 - created - request sucess, new resource created
    return res.status(201).json({
      message: "User created",
      payload: { _id: data._id, username: data.username, email: data.email },
    });
  } catch (err) {
    console.log(err.message);
    //internal server error - server does not know how to handle the error
    return res.status(500).json({ message: "Server error." });
  }
});

//login user after checking user exists
router.post("/login", async (req, res) => {
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
      return res.status(404).json({ message: "User does not exist." });
    }

    //check if password matches
    const isMatch = compare(data.password, user.password);
    if (!isMatch) {
      //unauthorized access
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const accessToken = generateAccessToken(user);
    //tokens are generated and response is sent
    return res.status(200).json({
      accessToken,
      payload: {
        _id: user._id,
        email: user.email,
      },
      expiresAt: "1h", // 15days //1hour
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "server error." }); //internal server error
  }
});

module.exports = router;
