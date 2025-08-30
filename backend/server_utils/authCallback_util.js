import dotenv from "dotenv";

dotenv.config();

const CLIENT_SECRET_WEBHOOK = process.env.CLIENT_ID_WEBHOOK;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.SECRET;
const REDIRECT_URI_AUTH = process.env.REDIRECT_URI_AUTH;
const REDIRECT_URI_WEBHOOK = process.env.REDIRECT_URI_WEBHOOK;

export async function getUserAccessToken(code) {
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

  const data = await tokenResp.json();

  return data.access_token;
}

export async function getBroadcastId(userAccessToken) {
  const userResp = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      "Client-Id": CLIENT_ID,
      Authorization: `Bearer ${userAccessToken}`,
    },
  });

  const userData = await userResp.json();

  return userData.data[0].id;
}

export async function getAppAccessToken() {
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

  const data = await response.json();

  return data.access_token;
}

export async function SubscribeToFollowEvent(
  app_accses_token,
  broadcaster_id,
  moderator_user_id
) {
  // if the moderator_user_id does not exist then we assume its the same as the broadcaster_id
  if (!moderator_user_id) {
    moderator_user_id = broadcaster_id;
  }
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
          secret: CLIENT_SECRET_WEBHOOK,
        },
      }),
    }
  );
  const data = await response_to_subscribe.json();
}

export async function SubscribeToGiftEvent(app_accses_token, broadcaster_id) {
  const response_to_gift = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${app_accses_token}`,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.subscription.gift",
        version: "1",
        condition: {
          broadcaster_user_id: broadcaster_id,
        },
        transport: {
          method: "webhook",
          callback: "https://example.com/webhooks/callback",
          secret: CLIENT_SECRET_WEBHOOK,
        },
      }),
    }
  );
  const data = await response_to_gift.json();
}

export async function SubscribeToRaidEvent(app_accses_token, broadcaster_id) {
  const response_to_raid = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${app_accses_token}`,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.raid",
        version: "1",
        condition: {
          to_broadcaster_user_id: broadcaster_id,
        },
        transport: {
          method: "webhook",
          callback: "https://example.com/webhooks/callback",
          secret: CLIENT_SECRET_WEBHOOK,
        },
      }),
    }
  );
  const data = await response_to_raid.json();
}

export async function SubscribeToCheerEvent(app_accses_token, broadcaster_id) {
  const response_to_cheer = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${app_accses_token}`,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.cheer",
        version: "1",
        condition: {
          broadcaster_user_id: broadcaster_id,
        },
        transport: {
          method: "webhook",
          callback: "https://example.com/webhooks/callback",
          secret: CLIENT_SECRET_WEBHOOK,
        },
      }),
    }
  );
  const data = await response_to_cheer.json();
}

export async function SubscribeToBitsEvent(app_accses_token, broadcaster_id) {
  const response_to_bits = await fetch(
    "https://api.twitch.tv/helix/eventsub/subscriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${app_accses_token}`,
        "Client-Id": CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "channel.bits.use",
        version: "1",
        condition: {
          broadcaster_user_id: broadcaster_id,
        },
        transport: {
          method: "webhook",
          callback: "https://example.com/webhooks/callback",
          secret: CLIENT_SECRET_WEBHOOK,
        },
      }),
    }
  );
  const data = await response_to_bits.json();
}

export async function subscribeToAllEvent(
  app_accses_token,
  broadcaster_id,
  moderator_user_id
) {
  const data_subscribe_cheer = SubscribeToCheerEvent(
    app_accses_token,
    broadcaster_id
  );
  console.log(await data_subscribe_cheer);

  const data_subscribe_follow = SubscribeToFollowEvent(
    app_accses_token,
    broadcaster_id,
    moderator_user_id
  );
  console.log(await data_subscribe_follow);

  const data_subscribe_gift = SubscribeToGiftEvent(
    app_accses_token,
    broadcaster_id
  );
  console.log(await data_subscribe_gift);

  const data_subscribe_raid = SubscribeToRaidEvent(
    app_accses_token,
    broadcaster_id
  );
  console.log(await data_subscribe_raid);

  const data_subscribe_bits = SubscribeToBitsEvent(
    app_accses_token,
    broadcaster_id
  );
  console.log(await data_subscribe_bits);

  return 200;
}

//channel.chat.message
