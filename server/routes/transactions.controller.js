const express = require("express");
const router = express.Router();

const { getDb } = require("../db");

//to get all transactions of a given user
router.get("/:userId", async (req, res) => {
  try {
    const db = getDb();

    const user = await db
      .collection("transactions")
      .findOne(
        { userId: req.params.userId },
        { projection: { _id: 0, userId: 1, transactions: 1 } }
      );

    //check if user has transactions
    if (!user || user.transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found or No transactions registered." });
    }

    //returns transactions of user
    return res.status(200).json({
      userId: user.userId,
      transactions: user.transactions,
    });
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

//to register a new transaction
router.post("/:userId", async (req, res) => {
  try {
    const transaction = {
      transactionId: "trxn" + new Date().getMilliseconds(),
      type: req.body.type,
      category: req.body.category,
      amount: req.body.amount,
      date: req.body.date,
    };

    const db = getDb();
    //add the new transaction into the user's transaction array
    const result = await db.collection("transactions").updateOne(
      { userId: req.params.userId }, //find the user by id
      { $push: { transactions: transaction } },
      { upsert: true } //creates a new document if user does not exist
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return res
        .status(200)
        .json({ message: "Transaction added successfully." });
    } else {
      return res.status(400).json({ message: "Failed to add transaction." });
    }
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

router.delete("/:userId/:transactionId", async (req, res) => {
  try {
    const { userId, transactionId } = req.params;

    const db = getDb();
    const result = await db
      .collection("transactions")
      .updateOne(
        { userId: userId },
        { $pull: { transactions: { transactionId: transactionId } } }
      );

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Transaction deleted successfully." });
    } else {
      return res.status(404).json({ message: "Transaction not found." });
    }
  } catch (err) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
