import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});

let db;

export async function connectToServer() {
  await client.connect();
  const dbName = process.env.DB_NAME || "test";
  db = client.db(dbName);
  console.log(`✅ Connected to MongoDB (db: ${dbName})`);
}

export function getDb() {
  if (!db) throw new Error("DB not initialized");
  return db;
}


const dbName = process.env.DB_NAME || "test"; db = client.db(insy7314_ice);