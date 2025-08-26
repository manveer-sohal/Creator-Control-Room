import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const user = process.env.USER;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.DBPORT;

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
  ssl: { rejectUnauthorized: false }, // RDS usually requires SSL
});

export default pool;
