import { Router } from "express";
import { getDb } from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import { requireAuth } from "../middleware/auth.mjs";

const router = Router();

// GET all posts (public)
router.get("/", async (req, res) => {
  try {
    const posts = await getDb().collection("posts").find({}).toArray();
    res.json(posts);
  } catch (err) {
    console.error("GET /posts error:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET one post (public)
router.get("/:id", async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const post = await getDb().collection("posts").findOne({ _id });
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch (err) {
    console.error("GET /posts/:id error:", err);
    res.status(400).json({ error: "Invalid id" });
  }
});

// CREATE (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const doc = { ...req.body, authorId: req.user.id, createdAt: new Date() };
    const result = await getDb().collection("posts").insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    console.error("POST /posts error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// UPDATE (protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const update = { $set: { ...req.body, updatedAt: new Date() } };
    const result = await getDb().collection("posts").updateOne({ _id }, update);
    if (result.matchedCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("PUT /posts/:id error:", err);
    res.status(400).json({ error: "Invalid id" });
  }
});

// DELETE (protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const result = await getDb().collection("posts").deleteOne({ _id });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /posts/:id error:", err);
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
