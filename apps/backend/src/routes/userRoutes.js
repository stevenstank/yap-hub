import express from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", (req, res) => {
  res.json({ message: "user route working" });
});

router.put("/:id", (req, res) => {
  res.json({ message: "user route working" });
});

export default router;
