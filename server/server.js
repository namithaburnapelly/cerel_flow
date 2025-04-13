const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); //so that server can correctly refernce the location of my angular built angular app

//configure dotenv to read data from env file
dotenv.config();

const { connectDB } = require("./db");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions.controller");
const transferRoutes = require("./routes/transfer.controller");

const app = express();

app.use(express.json());

// Serve Angular app
app.use(express.static(path.join(__dirname, "dist/cerel_flow")));

//enable cors
app.use(cors());

//routes
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/transfers", transferRoutes);

//connection to database
connectDB();

// // wildcard route for angular client-side routing
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist/cerel_flow", "index.html"));
// });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
