const { MongoClient } = require("mongodb");
const assert = require("assert");
const fs = require("fs");

require("dotenv").config();
const { MONGO_URI } = process.env;

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

    await client.connect();

    const db = client.db("exercise_1");

    const greetingResponse = await db
      .collection("greetings")
      .insertMany(greetings);

    assert.equal(1, greetingResponse.insertedCount);

    client.close();
  } catch ({ message }) {
    console.log(message);
  }

  //   res.status(201).json({ status: 201, data: req.body });
  // } catch ({ message }) {
  //   res.status(500).json({ status: 500, message });
  // }
};

batchImport();

module.exports = { batchImport };
