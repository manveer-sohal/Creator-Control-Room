import pool from "../libs/postgreSQL.js";

// Get Company_id from creator table
export async function getCompanyId(creator_name) {
  try {
    const result = await pool.query(
      "SELECT company_id FROM events WHERE name = $1",
      [creator_name]
    );
    console.log(result.row[0]);
    return result.row[0];
  } catch (err) {
    console.error(err);
    return [];
  }
}
