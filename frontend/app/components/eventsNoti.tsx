// import React, { useState } from "react";
import { eventObj } from "@/types";

export default function EventsNoti({ message_type, type }: eventObj) {
  //   const [creatorName, setCreatorName] = useState<string>("");

  return (
    <div className="flex bg-[#18181b] border-b-1 border-gray-500 h-12 top-0 z-10 gap-2 pt-3 pb-4">
      <p>{message_type}</p>
      <p>{type}</p>
    </div>
  );
}
