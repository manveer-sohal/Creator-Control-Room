import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
import dbRoutes from "./routes/dbRoutes.js";
import { serializeData } from "./socket_utils/twitchNoti_utils.js";
import {
  getAppAccessToken,
  getBroadcastId,
  getUserAccessToken,
  SubscribeToFollowEvent,
} from "./server_utils/authCallback_util.js";
import {
  logRevocation,
  verifyHMACSignature,
} from "./server_utils/webhookCallback_utils.js";
// import { instrument } from "@socket.io/admin-ui";

const REDIRECT_URI_DASHBOARD = process.env.REDIRECT_URI_DASHBOARD;

import { io, httpServer, app } from "./socket.js";

const port = process.env.PORT || 3001;
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") ?? [
  "http://localhost:3000",
];

// Middleware for cors origin
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Middleware to capture raw body (needed for signature verification)
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use("/db", dbRoutes);

// app.use("/api/clothes", clothesRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/weather", weatherRoutes);

app.get("/healthz", (_req, res) =>
  res.status(200).send("ok! All systems go!!")
);

app.get("/", (_req, res) => res.send("Go to /healthz for health check"));

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  // Using the code get the user access token
  const userAccessToken = getUserAccessToken(code);

  // Get the broadcast Id using the user access token
  const broadcaster_id = getBroadcastId(userAccessToken);
  // const broadcaster_username = userData.data[0].login;

  // Get app access token
  const app_accses_token = getAppAccessToken();

  // Subscribe to the event
  const data = subscribeToAllEvent(
    app_accses_token,
    broadcaster_id,
    broadcaster_id
  );

  // Redirect user to the dashboard
  res.redirect(REDIRECT_URI_DASHBOARD);
});

app.post("/webhooks/callback", async (req, res) => {
  // Gets the message type from the webhook
  const messageType = req.header("Twitch-Eventsub-Message-Type");

  //Handle verification challenge
  if (messageType === "webhook_callback_verification") {
    console.log("Verification request:", req.body);
    return res.status(200).send(req.body.challenge);
  }

  //Verify HMAC signature
  const messageId = req.header("Twitch-Eventsub-Message-Id");
  const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
  const signature = req.header("Twitch-Eventsub-Message-Signature");
  const hmacMessage = messageId + timestamp + req_rawBody;

  const status = verifyHMACSignature(hmacMessage, signature);

  if (status == 403) {
    return res.sendStatus(403);
  }

  /*
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
     */
  // Handle actual events
  if (messageType === "notification") {
    console.log("EVENT RECEIVED:", JSON.stringify(req.body, null, 2));
    //enter into databse
    const response = await fetch("/add-event", {
      headers: {
        method: "POST",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription_type: subscription_type,
        creator_id: creator_id,
        company_id: company_id,
        payload: payload,
      }),
    });
    console.log("db insert response:", await response);

    //Put the data into a format that is readable for frontend
    var data = serializeData(req.body);

    //send the data
    io.emit("Event", data);
    return res.sendStatus(204);
  }

  if ("revocation" === req.headers[MESSAGE_TYPE]) {
    logRevocation(req.body);

    return res.sendStatus(204);
  } else {
    console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
    return res.sendStatus(204);
  }
});

export function createServer() {
  return httpServer;
}

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(port, () => {
    console.log(
      `HTTP + Socket.IO server listening on http://localhost:${port}`
    );
  });
}

export { app };
