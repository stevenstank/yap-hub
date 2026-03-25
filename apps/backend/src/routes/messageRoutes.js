import express from "express";
import {
  deleteMessage,
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.delete("/:id", authMiddleware, deleteMessage);

router.get("/conversations", authMiddleware, getConversations);
router.get("/:userId", authMiddleware, getMessages);

export default router;
