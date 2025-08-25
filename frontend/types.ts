// example.ts
export interface User {
  id: number;
  name: string;
  email?: string; // Optional property
  greet(): void;
}

export interface eventObj {
  message_type: string;
  type: string;
}

export interface EventsWidgetProps {
  events: eventObj[];
}

export interface EventV2 {
  subscription: {
    id: string;
    type: string;
    version: string;
    status: string;
    cost: number;
    condition: {
      broadcaster_user_id: string;
      moderator_user_id: string;
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
