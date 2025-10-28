import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import { authenticate } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/auth", authRoutes);

// Films routes
app.get("/films", authenticate, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const films = await prisma.favfilms.findMany({ skip, take: limit });
    res.json({ data: films, hasMore: films.length === limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/films", authenticate, async (req, res) => {
  try {
    const newFilm = await prisma.favfilms.create({ data: req.body });
    res.status(201).json(newFilm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/films/:id", authenticate, async (req, res) => {
  try {
    const updated = await prisma.favfilms.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/films/:id", authenticate, async (req, res) => {
  try {
    await prisma.favfilms.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: "Film deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Export for Vercel
export default app;

// ✅ Start server locally (not executed in Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running locally on http://localhost:${PORT}`)
  );
}
