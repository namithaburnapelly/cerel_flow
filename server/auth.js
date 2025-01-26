const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//configure dotenv to read data from env file
dotenv.config();

//secret key for jwt
const secretkey = process.env.JWT_SECRET_KEY;

//generate jwt access token
function generateAccessToken(user) {
  return jwt.sign(
    { _id: user._id, email: user.email, password: user.password },
    secretkey,
    {
      expiresIn: "15s",
    }
  );
}

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

//function to compare two variables
function compare(a, b) {
  return a === b;
}

module.exports = { generateAccessToken, compare, authenticateToken };
