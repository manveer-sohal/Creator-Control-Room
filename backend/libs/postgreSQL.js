import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";

const { Pool } = pkg;

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_DBPORT;

const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
  ssl: { rejectUnauthorized: false }, // RDS usually requires SSL
});
export default pool;
