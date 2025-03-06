const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGOURI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

const connectDB = async () => {
  try {
    // Connect the client to the server
    await client.connect();
    db = client.db("CerelFlowDB");
    console.log("Connected to database");
  } catch (err) {
    console.log("Error connectiong to database", err.message);
    process.exit(1);
  }
};

const getDb = () => db;

module.exports = { connectDB, getDb };
