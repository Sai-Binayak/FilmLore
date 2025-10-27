import dotenv from "dotenv";
dotenv.config();

console.log("🔍 DATABASE_URL is:", process.env.DATABASE_URL);


import express from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();
app.use(cors());
app.use(express.json());

// MySQL setup
const db = mysql.createConnection({
  host: "localhost",
  user: "Sql_Database",
  password: "Q1w2e3r4t5_",
  database: "filmdb",
});

// GET all films (with pagination)
app.get("/films", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  db.query("SELECT * FROM favfilms LIMIT ? OFFSET ?", [limit, offset], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: results, hasMore: results.length === limit });
  });
});

// POST new film
app.post("/films", (req, res) => {
  const { title, type, director, budget, location, duration, year_or_time } = req.body;
  const sql = "INSERT INTO favfilms (title, type, director, budget, location, duration, year_or_time) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [title, type, director, budget, location, duration, year_or_time], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...req.body });
  });
});

// PUT (update film)
app.put("/films/:id", (req, res) => {
  const { id } = req.params;
  const { title, type, director, budget, location, duration, year_or_time } = req.body;
  const sql = "UPDATE favfilms SET title=?, type=?, director=?, budget=?, location=?, duration=?, year_or_time=? WHERE id=?";
  db.query(sql, [title, type, director, budget, location, duration, year_or_time, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, ...req.body });
  });
});

// DELETE film
app.delete("/films/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM favfilms WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
