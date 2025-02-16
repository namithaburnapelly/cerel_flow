const express = require("express");
const router = express.Router();

const { getDb } = require("../db");

//to get all transactions of a given user
router.get("/:userId", async (req, res) => {
  try {
    const db = getDb();

    const user = await db.collection("transactions").findOne(
      { userId: req.params.userId },
      //projection displays these values in the result output where; 0 - dont view, 1 - view
      { projection: { _id: 0, userId: 1, transactions: 1 } }
    );

    //check if user has transactions
    if (!user || user.transactions.length === 0) {
      return res.status(404).json({ message: "No transactions registered." });
    }

    //returns transactions of user
    return res.status(200).json({
      transactions: user.transactions,
    });
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

//Function to add if it exists as it is optional
const addIfExists = (key, value) =>
  value !== undefined ? { [key]: value } : {};

//to register a new transaction
router.post("/:userId", async (req, res) => {
  try {
    const transaction = {
      transactionId: "trxn" + new Date().getMilliseconds(),
      type: req.body.type,
      category: req.body.category,
      amount: req.body.amount,
      date: req.body.date,
      ...addIfExists("wallet", req.body.wallet), //spread operator used to add the key, value pair if exists
      ...addIfExists("description", req.body.description),
      ...addIfExists("screenshot", req.body.screenshot),
    };

    const db = getDb();
    //add the new transaction into the user's transaction array
    const result = await db.collection("transactions").updateOne(
      { userId: req.params.userId }, //find the user by id
      { $push: { transactions: transaction } },
      { upsert: true } //creates a new document if user does not exist
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return res.status(200).json(transaction);
    } else {
      return res.status(400).json({ message: "Failed to add transaction." });
    }
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

//to update a existing transaction
router.patch("/:userId/:transactionId", async (req, res) => {
  try {
    const { userId, transactionId } = req.params;
    const updatedData = req.body; //contains fields that need to be updated

    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ message: "No fields provided for update." });
    }

    const db = getDb();

    //map user input keys to mongodb update format
    const updatedFileds = Object.fromEntries(
      Object.entries(updatedData).map(([key, value]) => [
        `transactions.$[element].${key}`, //map keys correctly to mongodb update
        value,
      ])
    );

    //updating the fields
    const result = await db.collection("transactions").updateOne(
      { userId: userId, "transactions.transactionId": transactionId }, //finds the correct userid and  transaction id
      { $set: updatedFileds }, //set applies the maped updated
      { arrayFilters: [{ "element.transactionId": transactionId }] } //filter the correct transaction in array
    );

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Transaction updated successfully." });
    } else {
      return res.status(404).json({ message: "Transaction not found." });
    }
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

//deleting the transaction
router.delete("/:userId/:transactionId", async (req, res) => {
  try {
    const { userId, transactionId } = req.params;

    const db = getDb();
    const result = await db.collection("transactions").updateOne(
      { userId: userId }, //finds the user id in which the aciton to be done
      { $pull: { transactions: { transactionId: transactionId } } } //pull removes the transaction where transaction maps
    );

    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Transaction deleted successfully." });
    } else {
      return res.status(404).json({ message: "Transaction not found." });
    }
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
