const express = require("express");
const router = express.Router();

const { getDb } = require("../db");
const { authenticateToken } = require("../jwt.auth");

//to get all transactions of a given user
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.params.userId;

    //pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5; ///for now defaulting to 5
    const skip = (page - 1) * pageSize;

    //aggregation pipeline with arrray of operations for pagination
    const pipeline = [
      { $match: { userId: userId } },
      //projection displays these values in the result output where; 0 - dont view, 1 - view
      { $project: { transactions: 1 } },
      //deconstructs an array field
      //it will create separate document for each transaction
      { $unwind: "$transactions" },
      //replaces the entire document
      //to make each transaction the root of the document , so we can work easily while doing operations like skip and limit.
      { $replaceRoot: { newRoot: "$transactions" } },
      //sorts transactions by date in decreasing order
      { $sort: { date: -1 } },
      { $skip: skip }, //skip the previous records
      { $limit: pageSize }, //limits the no of records being returned
    ];

    //execute aggregation
    const paginatedTransactions = await db
      .collection("transactions")
      .aggregate(pipeline)
      .toArray();

    //result returns a object with _id and totalTransactions: number of transactions
    const result = await db
      .collection("transactions")
      .aggregate([
        { $match: { userId: userId } },
        { $project: { totalTransactions: { $size: "$transactions" } } },
        { $limit: 1 },
      ])
      .next(); //to get the first (and only) document

    const totalTransactions = result ? result.totalTransactions : 0;
    //check if user has transactions
    if (totalTransactions === 0) {
      return res.status(404).json({ message: "No transactions registered." });
    }

    //returns transactions of user
    return res.status(200).json({
      transactions: paginatedTransactions,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalTransactions,
        totalPages: Math.ceil(totalTransactions / pageSize),
      },
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
router.post("/:userId", authenticateToken, async (req, res) => {
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
router.patch("/:userId/:transactionId", authenticateToken, async (req, res) => {
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
router.delete(
  "/:userId/:transactionId",
  authenticateToken,
  async (req, res) => {
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
  }
);

module.exports = router;
