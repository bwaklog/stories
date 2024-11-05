import config from "../config/config.mjs";
import { MongoClient } from "mongodb";

const MONGO_ATLAS_URI = `mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.cluster}.5ufxp.mongodb.net/?retryWrites=true&w=majority&appName=${config.mongo.appName}`;
// NOTE: Local development 
const MONGO_LOCAL_URI = `mongodb://localhost:27017/`;

// const MONGO_DB_URI = process.env.DEV_MODE ? MONGO_LOCAL_URI : MONGO_ATLAS_URI;
const MONGO_DB_URI = MONGO_LOCAL_URI;

const client = new MongoClient(MONGO_LOCAL_URI);

async function initaliseClient() {
  try {
    await client.connect();
    console.log("[CONN][MONGO] Connected to MongoDB");
  } catch (err) {
    console.error(`[CONN][MONGO] Error connecting to MongoDB: ${err}`);
  }
}

async function attemptPing() {
  var pong = null;
  try {
    const pong = await client.db("admin").command({ ping: 1 });
    console.log("[CONN][MONGO] Pong: ", pong);
    return pong;
  } catch (err) {
    console.error(`[CONN][MONGO][ERROR] pinging MongoDB: ${err}`);
    return pong;
  }
}

let db = client.db(`${config.mongo.dbName}`);

// User collection
// NOTE: validate user
async function doesUserExist(user) {
  console.log("checking for user: ", user);
  let collection = db.collection("users");
  let result = await collection.findOne({ username: user });
  if (result) {
    console.log("User exists: ", result);
    return true;
  }
  return false;
}

// function to close client
export const closeClient = async () => {
  await client.close();
  console.log("[CONN][MONGO] Closed client connection");
}

export default { MONGO_DB_URI, db, client, initaliseClient, closeClient, attemptPing, doesUserExist };
