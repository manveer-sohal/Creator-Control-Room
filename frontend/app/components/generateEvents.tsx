// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import {
  follow_payload,
  bits_payload,
  raid_payload,
  cheer_payload,
  subscriber_payload,
  gifted_payload,
} from "../test/payload.js";
import { EventPayload } from "../../types";
interface ChildComponentProps {
  onAction: (data: EventPayload) => void; // Defines 'onAction' as a function that takes a string and returns void
}

export default function GenerateEvent({ onAction }: ChildComponentProps) {
  // LIST OF PAYLOAD TYPES
  const payload_list: EventPayload[] = [
    follow_payload,
    bits_payload,
    raid_payload,
    cheer_payload,
    subscriber_payload,
    gifted_payload,
  ];

  const getEvents = async () => {
    console.log("Pow");
    const response = await fetch(
      "https://a0c2b18f2a76.ngrok-free.app/db/events",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hi: "hello" }),
      }
    );
    console.log("show");

    const data = await response.json();
    console.log(data);
    console.log("brow");
  };
  // GENERATE RANDOM NUMBER
  function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ON CLICK SEND DATA TO THE ONACTION PROP
  const generateEvent = () => {
    const index = getRandomInt(0, payload_list.length - 1);
    onAction(payload_list[index]);
  };

  return (
    <div>
      {" "}
      <button onClick={generateEvent}>Generate Event</button>
      <button onClick={getEvents}>Get Event</button>
    </div>
  );
}
