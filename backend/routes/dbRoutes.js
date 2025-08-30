import express from "express";
import pool from "../libs/postgreSQL.js";
import { serializeData } from "../socket_utils/twitchNoti_utils.js";
const router = express.Router();

// Insert row
router.post("/add-event", async (req, res) => {
  const { subscription_type, creator_id, company_id, payload } = req.body;
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
});

function serializeDBData(data) {
  console.log(data);
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
  console.log("lets try");
  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE company_id = '11111111-1111-1111-1111-111111111111'"
    );
    console.log("bazinga!");
    let rows = [];
    for (let i in result.rows) {
      rows.push(serializeDBData(result.rows[i]));
    }
    return res.json(rows);
  } catch (err) {
    console.error(err);

    res.status(500).send("Error fetching users");
  }
});

export default router;
