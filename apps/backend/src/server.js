import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "API is running" });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "OK" });
  });

  app.get("/api/test-cors", (req, res) => {
    res.json({ success: true });
  });

  app.get("/api/db-test", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  });

  app.get("/api/messages-test", async (req, res) => {
    const messages = await prisma.message.findMany();
    res.json(messages);
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/users", userRoutes);

  return app;
}

export default function server() {
  const app = createApp();
  const PORT = process.env.PORT || 5000;

  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
