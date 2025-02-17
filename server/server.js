const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

//configure dotenv to read data from env file
dotenv.config();

const { connectDB } = require("./db");

const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions.controller");

const app = express();

app.use(express.json());
app.use(cors());

//routes
app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);

//connection to database
connectDB();

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
