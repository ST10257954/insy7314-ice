import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});

let db;

export async function connectToServer() {
  await client.connect();
  db = client.db("test"); // you can rename this if you like
  console.log("✅ Connected to MongoDB");
}

export function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

