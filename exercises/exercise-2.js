const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function createGreeting(req, res) {
  try {
    const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

    await client.connect();

    const db = client.db("exercise_1");

    const greetingResponse = await db
      .collection("greetings")
      .insertOne(req.body);

    assert.equal(1, greetingResponse.insertedCount);

    client.close();

    res.status(201).json({ status: 201, data: req.body });
  } catch ({ message }) {
    res.status(500).json({ status: 500, message });
  }
}

const getGreeting = async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();

  console.log(_id);

  const db = client.db("exercise_1");

  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    client.close();
  });
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db("exercise_1");
  const greetings = await db.collection("greetings").find().toArray();

  let start = 0;
  let limit = 25;

  if (req.query.start !== undefined) {
    start = Number(req.query.start);
  }
  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
  }
  if (greetings.length > 0) {
    res
      .status(200)
      .json({ status: 200, data: greetings.slice(start, start + limit) });
  } else {
    res.status(404);
  }
};

const deleteGreeting = async (req, res) => {
  const id = req.params._id;
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

  try {
    await client.connect();

    const db = client.db("exercise_1");
    const greetings = await db.collection("greetings").deleteOne({ id });

    assert.equal(1, greetings.deletedCount);

    res.status(204).json({ status: 204, data: id });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;
  const hello = req.body;
  const client = await MongoClient(MONGO_URI, { useUnifiedTopology: true });

  try {
    await client.connect();

    const db = client.db("exercise_1");
    const newValues = { $set: hello };

    if (req.body.hello === undefined) {
      throw new Error("Missing info");
    }

    const greetings = await db
      .collection("greetings")
      .updateOne({ _id }, newValues);
    assert.equal(1, greetings.matchedCount);
    assert.equal(1, greetings.modifiedCount);

    res.status(200).json({ status: 200, data: { _id, hello } });
  } catch (err) {
    res
      .status(500)
      .json({ status: 500, data: { ...req.body }, message: err.message });
  }
  client.close();
};

module.exports = {
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
  updateGreeting,
};
