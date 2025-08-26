// import React, { useState } from "react";
import { eventObj } from "@/types";

export default function EventsNoti({
  user_name,
  broadcaster_user_name,
  type,
}: eventObj) {
  //   const [creatorName, setCreatorName] = useState<string>("");

  var text = "Error unreadable type";
  if (type == "channel.follow") {
    text = `${user_name} followed ${broadcaster_user_name}`;
  }
  if (type == "channel.subscribe") {
    text = `${user_name} subscribed to ${broadcaster_user_name}`;
  }
  if (type == "channel.cheer") {
    text = `${user_name} cheered ${broadcaster_user_name}`;
  }
  if (type == "channel.bits.use") {
    text = `${user_name} gave bits to ${broadcaster_user_name}`;
  }
  if (type == "channel.raid") {
    text = `${user_name} RAIDED ${broadcaster_user_name}!`;
  }
  if (type == "channel.subscription.gift") {
    text = `${user_name} gifted ${broadcaster_user_name}`;
  }

  return (
    <div className="flex bg-[#18181b] border-b-1 border-gray-500 h-12 top-0 z-10 gap-2 pt-3 pb-4">
      <p>{text}</p>
    </div>
  );
}
