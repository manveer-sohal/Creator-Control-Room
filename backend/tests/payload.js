//The channel.follow subscription type sends a notification when a specified channel receives a follow.

export const follow_payload = {
  subscription: {
    id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
    type: "channel.follow",
    version: "2",
    status: "enabled",
    cost: 0,
    condition: {
      broadcaster_user_id: "1337",
      moderator_user_id: "1337",
    },
    transport: {
      method: "webhook",
      callback: "https://example.com/webhooks/callback",
    },
    created_at: "2019-11-16T10:11:12.634234626Z",
  },
  event: {
    user_id: "1234",
    user_login: "cool_user",
    user_name: "Cool_User",
    broadcaster_user_id: "1337",
    broadcaster_user_login: "cooler_user",
    broadcaster_user_name: "Cooler_User",
    followed_at: "2020-07-15T18:16:11.17106713Z",
  },
};
//NEW The channel.bits.use subscription type sends a notification whenever Bits are used on a channel.

export const bits_payload = {
  subscription: {
    id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
    type: "channel.bits.use",
    version: "1",
    status: "enabled",
    cost: 0,
    condition: {
      broadcaster_user_id: "1337",
    },
    transport: {
      method: "webhook",
      callback: "https://example.com/webhooks/callback",
    },
    created_at: "2019-11-16T10:11:12.634234626Z",
  },
  event: {
    user_id: "1234",
    user_login: "cool_user",
    user_name: "Cool_User",
    broadcaster_user_id: "1337",
    broadcaster_user_login: "cooler_user",
    broadcaster_user_name: "Cooler_User",
    bits: 2,
    type: "cheer",
    power_up: null,
    message: {
      text: "cheer1 hi cheer1",
      fragments: [
        {
          type: "cheermote",
          text: "cheer1",
          cheermote: {
            prefix: "cheer",
            bits: 1,
            tier: 1,
          },
          emote: null,
        },
        {
          type: "text",
          text: " hi ",
          cheermote: null,
          emote: null,
        },
        {
          type: "cheermote",
          text: "cheer1",
          cheermote: {
            prefix: "cheer",
            bits: 1,
            tier: 1,
          },
          emote: null,
        },
      ],
    },
  },
};

//The channel.subscribe subscription type sends a notification when a specified channel receives a subscriber. This does not include resubscribes.
export const subscriber_payload = {
  subscription: {
    id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
    type: "channel.subscribe",
    version: "1",
    status: "enabled",
    cost: 0,
    condition: {
      broadcaster_user_id: "1337",
    },
    transport: {
      method: "webhook",
      callback: "https://example.com/webhooks/callback",
    },
    created_at: "2019-11-16T10:11:12.634234626Z",
  },
  event: {
    user_id: "1234",
    user_login: "cool_user",
    user_name: "Cool_User",
    broadcaster_user_id: "1337",
    broadcaster_user_login: "cooler_user",
    broadcaster_user_name: "Cooler_User",
    tier: "1000",
    is_gift: false,
  },
};

//he channel.subscription.gift subscription type sends a notification when a user gives one or more gifted subscriptions in a channel.

const gifted_payload = {
  subscription: {
    id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
    type: "channel.subscription.gift",
    version: "1",
    status: "enabled",
    cost: 0,
    condition: {
      broadcaster_user_id: "1337",
    },
    transport: {
      method: "webhook",
      callback: "https://example.com/webhooks/callback",
    },
    created_at: "2019-11-16T10:11:12.634234626Z",
  },
  event: {
    user_id: "1234",
    user_login: "cool_user",
    user_name: "Cool_User",
    broadcaster_user_id: "1337",
    broadcaster_user_login: "cooler_user",
    broadcaster_user_name: "Cooler_User",
    total: 2,
    tier: "1000",
    cumulative_total: 284, //null if anonymous or not shared by the user
    is_anonymous: false,
  },
};

//The channel.cheer subscription type sends a notification when a user cheers on the specified channel.

export const cheer_payload = {
  subscription: {
    id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
    type: "channel.cheer",
    version: "1",
    status: "enabled",
    cost: 0,
    condition: {
      broadcaster_user_id: "1337",
    },
    transport: {
      method: "webhook",
      callback: "https://example.com/webhooks/callback",
    },
    created_at: "2019-11-16T10:11:12.634234626Z",
  },
  event: {
    is_anonymous: false,
    user_id: "1234", // null if is_anonymous=true
    user_login: "cool_user", // null if is_anonymous=true
    user_name: "Cool_User", // null if is_anonymous=true
    broadcaster_user_id: "1337",
    broadcaster_user_login: "cooler_user",
    broadcaster_user_name: "Cooler_User",
    message: "pogchamp",
    bits: 1000,
  },
};

// I only need premission from the channel being raided to get this payload
//The channel.raid subscription type sends a notification when a broadcaster raids another broadcaster’s channel.
export const raid_payload = {
  subscription: {
    id: "f1c2a387-161a-49f9-a165-0f21d7a4e1c4",
    type: "channel.raid",
    version: "1",
    status: "enabled",
    cost: 0,
    condition: {
      to_broadcaster_user_id: "1337",
    },
    transport: {
      method: "webhook",
      callback: "https://example.com/webhooks/callback",
    },
    created_at: "2019-11-16T10:11:12.634234626Z",
  },
  event: {
    from_broadcaster_user_id: "1234",
    from_broadcaster_user_login: "cool_user",
    from_broadcaster_user_name: "Cool_User",
    to_broadcaster_user_id: "1337",
    to_broadcaster_user_login: "cooler_user",
    to_broadcaster_user_name: "Cooler_User",
    viewers: 9001,
  },
};
