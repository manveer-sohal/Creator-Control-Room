// import React, { useState } from "react";
import { eventObj } from "@/types";

export default function EventsNoti({ message_type, type }: eventObj) {
  //   const [creatorName, setCreatorName] = useState<string>("");

  return (
    <div className="flex bg-indigo-400 w-full h-10 top-0 z-10 gap-2 p-2">
      <p>{message_type}</p>
      <p>{type}</p>
    </div>
  );
}
