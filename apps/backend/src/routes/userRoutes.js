import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", authMiddleware, updateUser);

export default router;
