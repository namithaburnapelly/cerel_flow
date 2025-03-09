const express = require("express");
const router = express.Router();

const { getDb } = require("../db");
const { authenticateToken } = require("../jwt.auth");
const { addIfExists, getSortObject, titleCase } = require("../helper");

const TransferCollection = "transfers";

router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const db = getDb();
    const userId = req.params.userId;

    //pagination parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const sortOrder = req.query.sortOrder;

    //aggregation pipeline with array of operations for pagination
    const pipeline = [
      { $match: { user_id: userId } },
      { $set: { date: { $toDate: "$date" } } },
      { $sort: getSortObject(sortOrder) },
      { $skip: skip },
      { $limit: pageSize },
    ];

    // excute aggregation
    const paginationTransfers = await db
      .collection(TransferCollection)
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
                { $eq: ["$type", "from"] }, //equals
                "$amount",
                0,
              ],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: ["type", "to"] }, "$amount", 0],
            },
          },
        },
      },
    ];

    const incomeExpenseResult = await db
      .collection(TransferCollection)
      .aggregate(incomeExpensePipeline)
      .next()
      .catch(() => null);

    const totalIncome = incomeExpenseResult
      ? incomeExpenseResult.totalIncome
      : 0;
    const totalExpenses = incomeExpenseResult
      ? incomeExpenseResult.totalExpenses
      : 0;

    //reuslt returns total number of transactions
    const totalTransfers = await db
      .collection(TransferCollection)
      .countDocuments({ user_id: userId });
    //if user has transfers
    if (totalTransfers === 0) {
      return res.status(404).json({ message: "No Transfers Found" });
    }

    //returns paginated transactions
    return res.status(200).json({
      transfers: paginationTransfers,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: totalTransfers,
        totalPages: Math.ceil(totalTransfers / pageSize),
      },
      totalIncome,
      totalExpenses,
      sortOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

//to register new transfer transaction
router.post("/:userId", authenticateToken, async (req, res) => {
  try {
    const transfer = {
      user_id: req.params.userId,
      transaction_id: "trxn" + Date.now(),
      recipient: titleCase(req.body.recipient),
      amount: req.body.amount,
      type: req.body.type,
      date: req.body.date,
      ...addIfExists("description", req.body.description),
      created_at: new Date(),
    };

    const db = getDb();
    //add new transaction of transfer into user's transfer array
    const result = await db.collection(TransferCollection).insertOne(transfer);

    if (result.insertedId) {
      return res
        .status(201) //created response
        .json({ message: "successfully added", newTransfer: transfer });
    } else {
      return res.status(400).json({ message: "Failed to add transaction." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

//to update a existing transfer transaction
router.patch("/:userId/:transactionId", authenticateToken, async (req, res) => {
  try {
    const { userId, transactionId } = req.params;
    const updatedData = req.body;

    if (Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ message: "No fields provided for update." });
    }

    const db = getDb();

    //map user input keys to mongo update format
    const updatedFields = Object.fromEntries(
      Object.entries(updatedData).map(([key, value]) => [
        key,
        key === "recipient" ? titleCase(value) : value,
      ])
    );

    //updating the data
    const result = await db.collection(TransferCollection).updateOne(
      { user_id: userId, transaction_id: transactionId },
      {
        $set: {
          updated_at: new Date(),
          ...updatedFields,
        },
      }
    );

    //extract updated transaction
    const updatedTransaction = await db
      .collection(TransferCollection)
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
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.delete(
  "/:userId/:transactionId",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, transactionId } = req.params;

      const db = getDb();

      const result = await db
        .collection(TransferCollection)
        .deleteOne({ user_id: userId, transaction_id: transactionId });

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
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

module.exports = router;
