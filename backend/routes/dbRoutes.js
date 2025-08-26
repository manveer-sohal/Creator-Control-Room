import express from "express";
import pool from "../libs/postgreSQL.js";

const router = express.Router();

// Create table
router.post("/create-table", async (req, res) => {
  try {
    await pool.query(`
      create table events(
        id uuid primary key default uuid_generate_v4(),
        platform text not null,       
        event_type text not null,
        broadcaster_id text,   
        Moderator_user_id text not null,        
        occurred_at timestamptz default now(),
        payload jsonb not null
        );
        create index on events (occurred_at desc);
    `);
    res.send("Table created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating table");
  }
});

// Insert row
router.post("/add-event", async (req, res) => {
  const { platform, type, occurred_at, payload } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting user");
  }
});

// Query rows
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

export default router;
