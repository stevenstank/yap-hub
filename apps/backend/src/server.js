import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";

export default function server() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(express.json());

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

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
