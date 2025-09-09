import express from "express";
import pool from "../libs/postgreSQL.js";

const router = express.Router();
import bcrypt from "bcrypt";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// RESIZE LOGO
import sharp from "sharp";

// CONVERT HEIC TO JPEG
import convert from "heic-convert";

// MIDDLEWARE FOR LOGO UPLOADS
import multer from "multer";

// ENV
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// UPLOADS LOGO TO MEMEORY
const uploadMem = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// S3 BUCKET FOR LOGO
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// UPLOAD LOGO TO S3 BUCKER
export async function uploadLogo(fileBuffer, fileName, mimetype, name) {
  try {
    console.log("____________\n");

    console.log("s3 fileBuffer:", fileBuffer);
    console.log("s3 fileName:", fileName);
    console.log("s3 mimetype:", mimetype);
    console.log("____________\n");

    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `logos/${name}`,
      Body: fileBuffer,
      ContentType: mimetype,
    };
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
  } catch (error) {
    console.log("Logo upload:", error);
    throw error;
  }
}

// CONVERT HEIC TO JPEG
async function convertToJpeg(imagebuffer) {
  try {
    const outputBuffer = await convert({
      buffer: imagebuffer, // the HEIC file buffer
      format: "JPEG", // output format
      quality: 1, // the jpeg compression quality, between 0 and 1
    });
    return outputBuffer;
  } catch (error) {
    console.error("Error converting to jpeg:", error);
    throw error;
  }
}

// REIZE IMAGE
async function resizeImageBuffer(imageBuffer, mimetype) {
  let newMimetype = mimetype;
  if (mimetype == "image/heic") {
    imageBuffer = await convertToJpeg(imageBuffer);
    newMimetype = "image/jpeg";
    console.log("____________\n");
    console.log("in convert: ", imageBuffer);
    console.log("____________\n");
  }

  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 300, height: 300 })
      .toBuffer();
    console.log("____________\n");
    console.log("resizedImageBuffer: ", resizedImageBuffer);
    console.log("____________\n");

    return { resizedImageBuffer, newMimetype };
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}

// update: check for duplicate company names
// Insert new user
router.post("/add_user", uploadMem.single("logo"), async (req, res) => {
  const { name, email, plainPassword } = req.body;
  const logo = req.file;
  console.log("____________\n");

  console.log("logo: ", logo);
  console.log("____________\n");

  let logourl = "";

  const { resizedImageBuffer, newMimetype } = await resizeImageBuffer(
    logo.buffer,
    logo.mimetype
  );

  console.log("____________\n");
  console.log("resizedImageBuffer: ", resizedImageBuffer);
  console.log("____________\n");

  try {
    uploadLogo(resizedImageBuffer, name, newMimetype, name);

    console.log("logourl: ", logourl);
  } catch (err) {
    console.error(err);
    res.json({ stats: 500, err: "Error uploading logo" });
  }

  const logoKey = `logos/${name}`;

  try {
    const password_hash = await bcrypt.hash(plainPassword, 10);

    // Insert it into DB
    const result = await pool.query(
      `INSERT INTO company (id, name, logo, password_hash, email) 
       VALUES (gen_random_uuid(), $1, $2, $3, $4)
       RETURNING id, name;`,
      [name, logoKey, password_hash, email]
    );

    const company_id = result.rows[0].id; // grab the new UUID
    const company_name = result.rows[0].name;

    res.json({ company_id, company_name });
  } catch (err) {
    console.error(err);
    res.json({ stats: 500, err: "Error inserting user" });
  }
});

router.post("/login", async (req, res) => {
  const { company_name, plainPassword } = req.body;
  console.log(company_name);
  try {
    const password_hash = await bcrypt.hash(plainPassword, 10);
    console.log();

    // Then insert it into Postgres:
    const response = await pool.query(
      `SELECT id, name, password_hash from company WHERE name = $1`,
      [company_name]
    );

    if (response.rowCount == 0) {
      console.log("Incorrect login");
      return res.json({ res: 401, error: "Invalid email or password" });
    }
    const user = response.rows[0];
    console.log(user);

    const match = await bcrypt.compare(plainPassword, user.password_hash);
    if (!match) {
      return res.json({ res: 401, error: "Invalid email or password" });
    }
    console.log(response.rows[0]);
    res.json({ res: 200, data: response.rows[0] });
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
    console.log(data);

    json = {
      type: "subscribe",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      tier: data.payload.tier,
      is_gift: data.payload.gift,
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
      from_broadcaster_user_name: data.payload.from_broadcaster_user_name,
      to_broadcaster_user_name: data.payload.to_broadcaster_user_name,
      viewers: data.payload.viewers,
    };
  }
  if (type == "channel.subscription.gift") {
    json = {
      type: "gift",
      user_name: user_name,
      broadcaster_user_name: broadcaster_user_name,
      tier: data.payload.tier,
      total: data.payload.total, // Number of gifts
    };
    //cumulative_total: 284, //null if anonymous or not shared by the user
    //is_anonymous: false,
  }
  return json;
}

// Get creators
router.post("/get_creators", async (req, res) => {
  const { company_id } = req.body;
  console.log("lets try");
  try {
    const result = await pool.query(
      "SELECT name, logo FROM creator WHERE company_id = $1",
      [company_id]
    );
    console.log("bazinga! got creators");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.json({ statis: 500, err: "Error fetching users" });
  }
});

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

    return res.json({ statis: 500, err: "Error fetching users" });
  }
});

// S3 routes
// POST logo for a company
router.post("/company/logo", async (req, res) => {
  const { company_name } = req.body;
  console.log("fire");

  console.log(company_name);

  try {
    // 1. Look up logo key in DB
    const result = await pool.query(
      "SELECT logo FROM company WHERE name = $1",
      [company_name]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    const logoKey = result.rows[0].logo; // e.g. logos/company123.png

    // 2. Generate signed URL
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: logoKey,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 min
    // 3. Return it to frontend
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating signed URL" });
  }
});

export default router;
