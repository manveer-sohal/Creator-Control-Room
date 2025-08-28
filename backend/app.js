import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();
import dbRoutes from "./routes/dbRoutes.js";
import { serializeData } from "./socket_utils/twitchNoti_utils.js";

// import { instrument } from "@socket.io/admin-ui";
const TWITCH_SIGNING_SECRET = process.env.SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.SECRET;
const REDIRECT_URI_AUTH = process.env.REDIRECT_URI_AUTH;
const REDIRECT_URI_DASHBOARD = process.env.REDIRECT_URI_DASHBOARD;

import { io, httpServer, app } from "./socket.js";

// const adminPass = process.env.ADMINPASS;
// const adminUser = process.env.ADMINUSER;

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

// app.use("/validate_username", async (req, res) => {
//   console.log("/subscribe_to_follow");
//   console.log(req.body);
//   const { broadcaster_user_name } = req.body;
//   console.log("broadcaster_user_name:", broadcaster_user_name);
//   if (!broadcaster_user_name) {
//     res.send(500);
//   }
//   // Get App Accsess token
//   const response_app_accses_token = await fetch(
//     "https://id.twitch.tv/oauth2/token",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         grant_type: "client_credentials",
//       }),
//     }
//   );

//   let data = await response_app_accses_token.json();
//   console.log("Reponse:", data);

//   const app_accses_token = data.access_token;

//   const response_broadcaster_user = await fetch(
//     `https://api.twitch.tv/helix/users?login=${broadcaster_user_name}`,
//     {
//       method: "GET",
//       headers: {
//         "Client-Id": CLIENT_ID,
//         Authorization: `Bearer ${app_accses_token}`,
//       },
//     }
//   );

//   data = await response_broadcaster_user.json();
//   const broadcaster_id = data.data[0].id;

//   console.log("broadcaster_id:", broadcaster_id);

//   res.json({ status: 200, broadcaster_id: broadcaster_id });

//Send user to this LINK `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=moderator:read:followers`

// FROM THE LINK EXTRACT CODE   https://a0c2b18f2a76.ngrok-free.app/webhooks/callback?code=7vkfoo35a8rnq04t9pt7pv7x06jm1q&scope=moderator%3Aread%3Afollowers

// const code = "";
// const response_user_accses_token = await fetch(
//   `https://id.twitch.tv/oauth2/token`,
//   {
//     method: "GET",
//     headers: {
//       Content_Type: "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       code: code,
//       grant_type: "authorization_code",
//       redirect_uri: REDIRECT_URI,
//     }),
//   }
// );

// const user_accses_token = response_user_accses_token.access_token;

//
// });

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
  const tokenResp = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI_AUTH,
    }),
  });

  let data = await tokenResp.json();
  const userAccessToken = data.access_token;

  // Get the broadcast Id using the user access token
  const userResp = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Client-Id": CLIENT_ID,
      Authorization: `Bearer ${userAccessToken}`,
    },
  });

  const userData = await userResp.json();
  const broadcaster_id = userData.data[0].id;
  // const broadcaster_username = userData.data[0].login;

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  data = await response.json();
  const app_accses_token = data.access_token;

  // Subscribe to the event
  const response_to_subscribe = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${app_accses_token}`,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.follow",
        version: "2",
        condition: {
          broadcaster_user_id: broadcaster_id,
          moderator_user_id: broadcaster_id, //This needs to accepet moderator later on
        },
        transport: {
          method: "webhook",
          callback: REDIRECT_URI_WEBHOOK,
          secret: CLIENT_ID_WEBHOOK,
        },
      }),
    }
  );
  data = await response_to_subscribe.json();

  res.redirect(REDIRECT_URI_DASHBOARD);
});

app.post("/webhooks/callback", async (req, res) => {
  // Gets the message type from the webhook
  const messageType = req.header("Twitch-Eventsub-Message-Type");
  console.log("messageType:", messageType);

  // ✅ 1. Handle verification challenge
  if (messageType === "webhook_callback_verification") {
    console.log("Verification request:", req.body);
    return res.status(200).send(req.body.challenge);
  }

  // ✅ 2. Verify HMAC signature
  const messageId = req.header("Twitch-Eventsub-Message-Id");
  const timestamp = req.header("Twitch-Eventsub-Message-Timestamp");
  const signature = req.header("Twitch-Eventsub-Message-Signature");

  const hmacMessage = messageId + timestamp + req.rawBody;
  const hmac = crypto
    .createHmac("sha256", TWITCH_SIGNING_SECRET)
    .update(hmacMessage)
    .digest("hex");

  const expectedSignature = `sha256=${hmac}`;

  if (signature !== expectedSignature) {
    console.error("Invalid signature");
    return res.sendStatus(403);
  }
  // Challenge sent by twitch
  else if ("webhook_callback_verification" === messageType) {
    res
      .set("Content-Type", "text/plain")
      .status(200)
      .send(notification.challenge);
  }

  // ✅ 3. Handle actual events
  else if (messageType === "notification") {
    console.log("EVENT RECEIVED:", JSON.stringify(req.body, null, 2));

    //Put the data into a format that is readable for frontend
    var data = serializeData(req.body);
    //send the data
    io.emit("Event", data);

    // Example: log the follow event
  } else if (req.body.subscription.type === "channel.follow") {
    const { user_name, broadcaster_user_name } = req.body.event;
    console.log(`${user_name} followed ${broadcaster_user_name}!`);
  } else if ("revocation" === req.headers[MESSAGE_TYPE]) {
    res.sendStatus(204);

    console.log(`${notification.subscription.type} notifications revoked!`);
    console.log(`reason: ${notification.subscription.status}`);
    console.log(
      `condition: ${JSON.stringify(
        notification.subscription.condition,
        null,
        4
      )}`
    );
  } else {
    res.sendStatus(204);
    console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
  }

  res.sendStatus(200);
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
