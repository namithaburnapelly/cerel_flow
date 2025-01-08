const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

//port where sever is running
const PORT = 3000;

//mock data of user
// const user = {
//   id: "1",
//   email: "aa@gmail.com",
// };

//secret key for jwt
const secretkey = "hyderabad_TS";

//generate jwt access token
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, password: user.password },
    secretkey,
    {
      expiresIn: "15s",
    }
  );
}

app.post("/auth/login", (req, res) => {
  const user = {
    id: "id" + new Date().getMilliseconds(),
    email: req.body.email,
    password: req.body.password,
  };
  const accessToken = generateAccessToken(user);

  //tokens are generated and response is sent
  res.json({
    accessToken,
    payload: user,
    expiresAt: "15s", // 15days
  });
});

function authenticateToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header.split(" ")[1];

  if (!token) {
    // 401 unauthorized access
    return res.status(401).send("Access key required");
  }

  jwt.verify(token, secretkey, (err, data) => {
    if (err) {
      // 403 forbidden - no rights to access to content
      return res.status(403).send("Invalid access key");
    }

    req.user = user;
    next();
  });
}

app.get("/private/home", authenticateToken, (req, res) => {
  res.json({
    message: "this is protected route",
    user: req.user,
  });
});

app.listen(PORT, () => console.log(`server running at portno ${PORT}`));
