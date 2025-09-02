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
    console.log("Creator pushed");
    return "Creator pushed";
  } catch (err) {
    console.log("event not pushed");

    console.error(err);
    return "event not pushed";
  }
}

export async function addCreator(
  broadcaster_id,
  company_id,
  name,
  profile_image_url
) {
  try {
    await pool.query(
      "INSERT INTO creator (id, broadcaster_id, company_id, name, logo) VALUES (gen_random_uuid(), $1, $2, $3, $4)",
      [broadcaster_id, company_id, name, profile_image_url]
    );
    console.log("Creator added");
  } catch (err) {
    console.log("Creator not added");
    console.error(err);
  }
}
