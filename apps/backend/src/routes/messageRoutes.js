import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);

router.get("/conversations", authMiddleware, getConversations);
router.get("/:userId", authMiddleware, getMessages);

export default router;
