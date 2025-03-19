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
      { $set: { date: { $toDate: "$date" } } },
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
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                //condition
                { $eq: ["$type", "Income"] }, //equals
                "$amount",
                0,
              ],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0],
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

    const totalTransactions = await db
      .collection(TransactionCollection)
      .countDocuments({ user_id: userId });
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
      user_id: req.params.userId,
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
    const result = await db
      .collection(TransactionCollection)
      .insertOne(transaction);

    if (result.insertedId) {
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
        key, //map keys correctly to mongodb update
        key === "category" ? titleCase(value) : value,
      ]),
    );

    //updating the fields
    const result = await db.collection(TransactionCollection).updateOne(
      { user_id: userId, transaction_id: transactionId }, //finds the correct userid and  transaction id
      {
        $set: {
          updated_at: new Date(), // Ensure updatedDate is always set
          ...updatedFileds,
        },
      }, //set applies the maped updated
    );

    // Extract the updated transaction
    const updatedTransaction = await db
      .collection(TransactionCollection)
      .findOne({ user_id: userId, transaction_id: transactionId });

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

      const result = await db.collection(TransactionCollection).deleteOne({
        user_id: userId,
        transaction_id: transactionId,
      });

      if (result.deletedCount > 0) {
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
  },
);

module.exports = router;
