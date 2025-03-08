const express = require("express");
const router = express.Router();

const { getDb } = require("../db");
const { authenticateToken } = require("../jwt.auth");
const { addIfExists, getSortObject, titleCase } = require("../helper");

const TransactionCollection = "transactions";
//to get all transactions of a given user
router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.params.userId;

    //pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5; ///for now defaulting to 5
    const skip = (page - 1) * pageSize;
    const sortOrder = req.query.sortOrder;

    //aggregation pipeline with arrray of operations for pagination
    const pipeline = [
      { $match: { user_id: userId } },
      //projection displays these values in the result output where; 0 - dont view, 1 - view
      { $project: { transactions: 1 } },
      //deconstructs an array field
      //it will create separate document for each transaction
      { $unwind: "$transactions" },
      { $set: { "transfers.date": { $toDate: "$transfers.date" } } },
      //replaces the entire document
      //to make each transaction the root of the document , so we can work easily while doing operations like skip and limit.
      { $replaceRoot: { newRoot: "$transactions" } },
      //sorts transactions by date in decreasing order
      { $sort: getSortObject(sortOrder) },
      { $skip: skip }, //skip the previous records
      { $limit: pageSize }, //limits the no of records being returned
    ];

    //execute aggregation
    const paginatedTransactions = await db
      .collection(TransactionCollection)
      .aggregate(pipeline)
      .toArray();

    //to get total income and expense
    const incomeExpensePipeline = [
      { $match: { user_id: userId } },
      { $unwind: "$transactions" },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                //condition
                { $eq: ["$transactions.type", "Income"] }, //equals
                "$transactions.amount",
                0,
              ],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [
                { $eq: ["$transactions.type", "Expense"] },
                "$transactions.amount",
                0,
              ],
            },
          },
        },
      },
    ];

    const incomeExpenseResult = await db
      .collection(TransactionCollection)
      .aggregate(incomeExpensePipeline)
      .next()
      .catch(() => null);

    const totalIncome = incomeExpenseResult
      ? incomeExpenseResult.totalIncome
      : 0;
    const totalExpenses = incomeExpenseResult
      ? incomeExpenseResult.totalExpenses
      : 0;

    //result returns a object with _id and totalTransactions: number of transactions
    const result = await db
      .collection(TransactionCollection)
      .aggregate([
        { $match: { user_id: userId } },
        { $project: { totalTransactions: { $size: "$transactions" } } },
        { $limit: 1 },
      ])
      .next(); //to get the first (and only) document

    const totalTransactions = result ? result.totalTransactions : 0;
    //check if user has transactions
    if (totalTransactions === 0) {
      return res.status(404).json({ message: "No Transactions Found" });
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
      totalIncome,
      totalExpenses,
      sortOrder,
    });
  } catch (error) {
    console.log(error);
    //serve error
    res.status(500).json({ message: "Server error." });
  }
});

//to register a new transaction
router.post("/:userId", authenticateToken, async (req, res) => {
  try {
    const transaction = {
      transaction_id: "trxn" + Date.now(),
      type: req.body.type,
      category: titleCase(req.body.category),
      amount: req.body.amount,
      date: req.body.date,
      ...addIfExists("description", req.body.description),
      ...addIfExists("screenshot", req.body.screenshot?.trim()),
      created_at: new Date(),
    };

    const db = getDb();
    //add the new transaction into the user's transaction array
    const result = await db.collection(TransactionCollection).updateOne(
      { user_id: req.params.userId }, //find the user by id
      { $push: { transactions: transaction } },
      { upsert: true } //creates a new document if user does not exist
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return res
        .status(200)
        .json({ message: "successfully added", newTransaction: transaction });
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
        key === "category" ? titleCase(value) : value,
      ])
    );

    //updating the fields
    const result = await db.collection(TransactionCollection).updateOne(
      { user_id: userId, "transactions.transaction_id": transactionId }, //finds the correct userid and  transaction id
      {
        $set: {
          "transactions.$[element].updated_at": new Date(), // Ensure updatedDate is always set
          ...updatedFileds,
        },
      }, //set applies the maped updated
      { arrayFilters: [{ "element.transaction_id": transactionId }] } //filter the correct transaction in array
    );

    // Fetch the updated transaction
    const updatedDocument = await db.collection(TransactionCollection).findOne(
      { user_id: userId, "transactions.transaction_id": transactionId }, // Find the updated document
      {
        projection: {
          transactions: { $elemMatch: { transaction_id: transactionId } },
        },
      } // Only return the matched transaction
    );

    // Extract the updated transaction
    const updatedTransaction = updatedDocument?.transactions[0];

    if (result.modifiedCount > 0) {
      return res.status(200).json({
        message: "Transaction updated successfully.",
        updatedTransaction: updatedTransaction,
      });
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

      //check if user exists
      const userExists = await db.collection(TransactionCollection).findOne({
        user_id: userId,
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found." });
      }

      const result = await db.collection(TransactionCollection).updateOne(
        { user_id: userId }, //finds the user id in which the aciton to be done
        { $pull: { transactions: { transaction_id: transactionId } } } //pull removes the transaction where transaction maps
      );

      if (result.modifiedCount > 0) {
        return res
          .status(200)
          .json({ message: "Transaction deleted successfully." });
      } else {
        return res
          .status(404)
          .json({ message: "Transaction not found for this user." });
      }
    } catch (error) {
      console.log(error);
      //serve error
      res.status(500).json({ message: "Server error." });
    }
  }
);

module.exports = router;
