import express from "express";
import pool from "../libs/postgreSQL.js";
const router = express.Router();
import bcrypt from "bcrypt";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadLogo(fileBuffer, fileName, mimetype) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `logos/${fileName}`,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: "public-read", // makes it viewable via URL
  };

  return await s3.upload(params).promise();
}

// update: check for duplicate company names
// Insert new user
router.post("/add_user", async (req, res) => {
  const { name, email, plainPassword, logo } = req.body;
  try {
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // Insert it into DB
    const result = await pool.query(
      `INSERT INTO company (id, name, logo, password_hash, email) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       RETURNING id;`,
      [name, logo, password_hash, email]
    );

    const company_id = result.rows[0].id; // grab the new UUID
    const logo_url = uploadLogo();

    res.json({ company_id });
  } catch (err) {
    console.error(err);
    res.json({ stats: 500, err: "Error inserting user" });
  }
});

router.post("/login", async (req, res) => {
  const { name, plainPassword } = req.body;
  try {
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // Then insert it into Postgres:
    const response = await pool.query(
      `SELECT id from company WHERE name = $1 AND password = $2`,
      [name, password_hash]
    );

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error inserting user");
  }
});

function serializeDBData(data) {
  var user_name = data.payload.user_name;
  var broadcaster_user_name = data.payload.broadcaster_user_name;
  var type = data.subscription_type;
  var json = {};
  if (type == "channel.follow") {
    json = {
      type: "follow",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
    };
  }
  if (type == "channel.subscribe") {
    json = {
      type: "subscribe",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      teir: event_data.event.teir,
      is_gift: event_data.event.gift,
    };
  }
  if (type == "channel.cheer") {
    json = {
      type: "cheer",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      message: data.payload.message, // pogchamp
      bits: data.payload.bits, // 1000
    };
  }
  if (type == "channel.bits.use") {
    json = {
      type: "bits",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      bits: data.payload.bits,
      // event_type: event_data.event.event, // type: "cheer",
      // power_up: event_data.event.power_up, // power_up: null,
      message: data.payload.message, // This will be multiple objects
    };
  }
  if (type == "channel.raid") {
    json = {
      type: "raid",
      from_broadcaster_user_name: event_data.event.from_broadcaster_user_name,
      to_broadcaster_user_name: event_data.event.to_broadcaster_user_name,
      viewers: event_data.event.viewers,
    };
  }
  if (type == "channel.subscription.gift") {
    json = {
      type: "gift",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      teir: event_data.event.teir,
      total: event_data.event.total, // Number of gifts
    };
    //cumulative_total: 284, //null if anonymous or not shared by the user
    //is_anonymous: false,
  }
  return json;
}
// Query rows
router.post("/events", async (req, res) => {
  const { company_id } = req.body;
  console.log("lets try");
  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE company_id = $1",
      [company_id]
    );
    console.log("bazinga!");
    let rows = [];
    for (let i in result.rows) {
      rows.push(serializeDBData(result.rows[i]));
    }
    return res.json(rows);
  } catch (err) {
    console.error(err);

    res.json({ statis: 500, err: "Error fetching users" });
  }
});

export default router;
