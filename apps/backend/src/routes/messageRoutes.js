import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "message route working" });
});

router.get("/:userId", (req, res) => {
  res.json({ message: "message route working" });
});

export default router;
