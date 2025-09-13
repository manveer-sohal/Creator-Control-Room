export type CreatorInfo = {
  logo: string;
  broadcaster_id: string;
};
// Follow
interface FollowEvent {
  type: "follow";
  user_name: string;
  broadcaster_user_name: string;
}

// Subscriber
interface SubscriberEvent {
  type: "subscribe";
  user_name: string;
  broadcaster_user_name: string;
  tier: number;
  is_gift: boolean | null;
}

// Cheer
interface CheerEvent {
  type: "cheer";
  user_name: string;
  broadcaster_user_name: string;
  message: string; // e.g. "pogchamp"
  bits: number;
}

// Bits Use
interface BitsUseEvent {
  type: "bits";
  user_name: string;
  broadcaster_user_name: string;
  bits: number;
  event_type: string; // "cheer"
  power_up: unknown | null;
  message: {
    text: string;
    fragments: {
      type: string;
      text: string;
      cheermote: {
        prefix: string;
        bits: number;
        tier: number;
      } | null;
      emote: unknown | null;
    }[];
  }; // multiple objects, JSON structure
}

// Raid
interface RaidEvent {
  type: "raid";
  from_broadcaster_user_name: string;
  to_broadcaster_user_name: string;
  viewers: number;
}

// Gift
interface GiftEvent {
  type: "gift";
  user_name: string;
  broadcaster_user_name: string;
  tier: number;
  total: number;
}

export type EventObj =
  | FollowEvent
  | SubscriberEvent
  | CheerEvent
  | BitsUseEvent
  | RaidEvent
  | GiftEvent;

export interface EventsWidgetProps {
  events: EventObj[];
}

export interface Subscription {
  subscription: {
    id: string;
    type: string;
    version: string;
    status: string;
    cost: number;
    condition:
      | { broadcaster_user_id: string; moderator_user_id: string }
      | { broadcaster_user_id: string }
      | { to_broadcaster_user_id: string };
    transport: {
      method: string;
      callback: string;
    };
    created_at: string;
  };
}

export interface Event_raid extends Subscription {
  event: {
    from_broadcaster_user_id: string;
    from_broadcaster_user_login: string;
    from_broadcaster_user_name: string;
    to_broadcaster_user_id: string;
    to_broadcaster_user_login: string;
    to_broadcaster_user_name: string;
    viewers: number;
  };
}

export interface Event_cheer extends Subscription {
  event: {
    is_anonymous: boolean;
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    message: string;
    bits: number;
  };
}

export interface Event_gifted extends Subscription {
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    total: number;
    tier: string;
    cumulative_total: number | null; //null if anonymous or not shared by the user
    is_anonymous: boolean;
  };
}

export interface Event_subscriber extends Subscription {
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    tier: string;
    is_gift: boolean;
  };
}

export interface Event_bits extends Subscription {
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    bits: number;
    type: string;
    power_up: unknown | null;
    message: {
      text: string;
      fragments: {
        type: string;
        text: string;
        cheermote: {
          prefix: string;
          bits: number;
          tier: number;
        } | null;
        emote: unknown | null;
      }[];
    };
  };
}

export interface Event_follow extends Subscription {
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    followed_at: string;
  };
}

export type EventPayload =
  | Event_bits
  | Event_cheer
  | Event_follow
  | Event_gifted
  | Event_raid
  | Event_subscriber;

export interface EventV2 {
  subscription: {
    id: string;
    type: string;
    version: string;
    status: string;
    cost: number;
    condition:
      | {
          broadcaster_user_id: string;
          moderator_user_id: string;
        }
      | {
          broadcaster_user_id: string;
        };
    transport: {
      method: string;
      callback: string;
    };
    created_at: string;
  };
  event: {
    user_id: string;
    user_login: string;
    user_name: string;
    broadcaster_user_id: string;
    broadcaster_user_login: string;
    broadcaster_user_name: string;
    followed_at: string;
  };
}
export interface EventV1 {
  metadata: {
    message_id: string;
    message_type: string;
    message_timestamp: string;
    subscription_type: string;
    subscription_version: string;
  };
  payload: {
    subscription: {
      id: string;
      status: string;
      type: string;
      version: string;
      cost: number;
      condition: {
        broadcaster_user_id: string;
      };
      transport: {
        method: string;
        session_id: string;
      };
      created_at: string;
    };
    event: {
      user_id: string;
      user_login: string;
      user_name: string;
      broadcaster_user_id: string;
      broadcaster_user_login: string;
      broadcaster_user_name: string;
      followed_at: string;
    };
  };
}

export interface Product {
  name: string;
  price: number;
  isInStock: boolean;
}
