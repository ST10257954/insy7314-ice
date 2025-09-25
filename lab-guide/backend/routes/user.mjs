import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "../db/conn.mjs";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email & password required" });

  const db = getDb();
  const exists = await db.collection("users").findOne({ email });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const { insertedId } = await db.collection("users").insertOne({ email, password: hash });

  const token = jwt.sign({ sub: insertedId, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const db = getDb();
  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

export default router;
