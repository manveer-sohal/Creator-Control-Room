// import React, { useState } from "react";
import { EventObj } from "@/types";

export default function EventsNoti(event: EventObj) {
  //   const [creatorName, setCreatorName] = useState<string>("");

  let text = "Error unreadable type";
  switch (event.type) {
    case "follow":
      text = `${event.user_name} followed ${event.broadcaster_user_name}`;
      break;

    case "subscribe":
      text = `${event.user_name} subscribed to ${event.broadcaster_user_name}`;
      break;

    case "cheer":
      text = `${event.user_name} cheered ${event.bits} bits in ${event.broadcaster_user_name}'s chat: ${event.message}`;
      break;

    case "bits":
      text = `${event.user_name} gave ${event.bits} bits to ${event.broadcaster_user_name}`;
      break;

    case "raid":
      text = `${event.from_broadcaster_user_name} RAIDED ${event.to_broadcaster_user_name} with ${event.viewers} viewers!`;
      break;

    case "gift":
      text = `${event.user_name} gifted ${event.total} subs in ${event.broadcaster_user_name}'s chat`;
      break;
  }

  return (
    <div className="flex bg-[#18181b] border-b-1 border-gray-500 h-auto top-0 z-10 gap-2 pt-3 pb-4">
      <p>{text}</p>
    </div>
  );
}
