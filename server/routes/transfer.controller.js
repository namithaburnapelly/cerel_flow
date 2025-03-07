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
      //projection displays these values in the result output
      { $project: { transfers: 1 } },
      //deconstructs an array field
      //it will create separate document for each transfer
      { $unwind: "$transfers" },
      { $set: { "transfers.date": { $toDate: "$transfers.date" } } },
      //replaces the entire document
      //to make each transaction the root of the document, so we can work easily doing operations like skip and limit.
      { $replaceRoot: { newRoot: "$transfers" } },
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
      { $unwind: "$transfers" },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [
                //condition
                { $eq: ["$transfers.type", "from"] }, //equals
                "$transfers.amount",
                0,
              ],
            },
          },
          totalExpenses: {
            $sum: {
              $cond: [
                { $eq: ["$transfers.type", "to"] },
                "$transfers.amount",
                0,
              ],
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
    const result = await db
      .collection(TransferCollection)
      .aggregate([
        { $match: { user_id: userId } },
        { $project: { totalTransfers: { $size: "$transfers" } } },
        { $limit: 1 }, //to ensure one document is returned
      ])
      .next();

    const totalTransfers = result ? result.totalTransfers : 0;
    //if user has transfers
    if (totalTransfers === 0) {
      return res.status(404).json({ message: "No transactions registered." });
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
    const result = await db.collection(TransferCollection).updateOne(
      { user_id: req.params.userId },
      { $push: { transfers: transfer } },
      { upsert: true } //creates a new document if user does not exist
    );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      return res
        .status(200)
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
        `transfers.$[element].${key}`,
        key === "recipient" ? titleCase(value) : value,
      ])
    );
    //updating the data
    const result = await db.collection(TransferCollection).updateOne(
      { user_id: userId, "transfers.transaction_id": transactionId },
      {
        $set: {
          "transfers.$[element].updated_at": new Date(),
          ...updatedFields,
        },
      },
      { arrayFilters: [{ "element.transaction_id": transactionId }] }
    );

    //fetch updated transactions
    const updatedDocument = await db.collection(TransferCollection).findOne(
      { user_id: userId, "transfers.transaction_id": transactionId },
      {
        projection: {
          transfers: { $elemMatch: { transaction_id: transactionId } },
        },
      } //return the matched transaction of transfer
    );

    //extract updated transaction
    const updatedTransaction = updatedDocument?.transfers[0];

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

      //check if user exists
      const userExists = await db.collection(TransferCollection).findOne({
        user_id: userId,
      });

      if (!userExists) {
        return res.status(404).json({ message: "User not found." });
      }

      const result = await db
        .collection(TransferCollection)
        .updateOne(
          { user_id: userId },
          { $pull: { transfers: { transaction_id: transactionId } } }
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
      console.error(error);
      res.status(500).json({ message: "Server error." });
    }
  }
);

module.exports = router;
