import express from "express";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectToServer } from "./db/conn.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Simple test route
app.get("/health", (req, res) => res.json({ status: "ok" }));

async function start() {
  try {
    await connectToServer();

    const options = {
key: fs.readFileSync(path.join(__dirname, "keys", "privatekey.pem")),
      cert: fs.readFileSync(path.join(__dirname, "keys", "certificate.pem")),
    };

    https.createServer(options, app).listen(3000, () => {
      console.log("🚀 HTTPS server on https://localhost:3000");
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
