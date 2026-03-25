import express from "express";
import { signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", (req, res) => {
  res.json({ message: "route working" });
});

router.get("/me", (req, res) => {
  res.json({ message: "route working" });
});

export default router;
