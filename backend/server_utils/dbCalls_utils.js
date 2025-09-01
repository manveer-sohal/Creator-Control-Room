import pool from "../libs/postgreSQL.js";

// Get Company_id from creator table
export async function getIDsForEvent(creator_name) {
  try {
    const result = await pool.query(
      "SELECT company_id, id FROM creator WHERE name = $1",
      [creator_name]
    );

    return result.rows[0];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function pushEvent(
  subscription_type,
  creator_id,
  company_id,
  payload
) {
  try {
    const result = await pool.query(
      "INSERT INTO events (id, subscription_type, creator_id, company_id, payload, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())",
      [subscription_type, creator_id, company_id, payload]
    );
    res.json(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting user");
  }
}
