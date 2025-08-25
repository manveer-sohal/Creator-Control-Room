"use client";

import Image from "next/image";
import CreatorsLive from "./components/creatorsLive";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";

import react, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import GenerateEvent from "./components/generateEvents";
import EventsWidget from "./components/eventsWidget";

// import { EventV2 } from "../types";
// import { EventsWidgetProps } from "../types";
import { eventObj } from "../types";

declare global {
  // extend the global scope for dev/HMR
  var __SOCKET__: Socket | undefined;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ msg: string; key: string }[]>([]);
  const [key, setKey] = useState<string>("");
  const [event, setEvent] = useState<Event>();
  const [displayEventList, setDisplayEventList] = useState<eventObj[]>([]);

  const creators = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Crazy1Prabh", logo: "/vercel.svg" },
    { id: 2, name: "JasonTheWeen", logo: "/vercel.svg" },
    { id: 3, name: "StableRonaldo", logo: "/vercel.svg" },
  ];
  // FORM SUBMISSION
  // const handleSubmit = (e: react.FormEvent) => {
  //   e.preventDefault();
  //   socketRef.current?.emit("chat message", { msg: message, key: key });
  //   setMessage("");
  //   setKey("");
  // };

  // ON HOIST USE EFFECT
  useEffect(() => {
    if (!globalThis.__SOCKET__) {
      globalThis.__SOCKET__ = io("http://localhost:3001", {
        transports: ["websocket", "polling"],
      });
    }
    const s = globalThis.__SOCKET__;
    socketRef.current = s;

    // SOCKET FUNCTIONS

    const onEvent = (event: eventObj) => {
      setDisplayEventList((prev) => [...prev, event]);
    };

    // SOCKET CONNECTIONS

    s.on("Event", onEvent);

    //DISCONNECT SOCKETS
    return () => {
      s.off("Event", onHistory);

      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  // GENERATE AN EVENT REQUEST
  const generateTheEvent = (dataFromChild: Event) => {
    setEvent(dataFromChild);
    socketRef.current?.emit("Event", dataFromChild);
  };

  return (
    // Shell controls height + scrolling behavior
    <div className="grid grid-rows-[auto_1fr] h-[100svh] overflow-hidden bg-amber-950 text-white">
      {/* Header row */}
      <header className="sticky top-0 h-14 z-50">
        <NavBar />
      </header>

      {/* Content row: 2 columns */}
      <div className="grid min-h-0 grid-cols-[16rem_1fr]">
        {/* Left column (sidebar): fixed width */}
        <aside className="min-h-0 overflow-y-auto">
          <SideBar />
        </aside>

        {/* Right column (main): takes remaining space, scrolls */}
        <main className="min-w-0 overflow-y-auto p-6 gap-4">
          <div className="grid min-h-0 grid-cols-[16rem_1fr]">
            <GenerateEvent onAction={generateTheEvent}></GenerateEvent>
            <CreatorsLive creators={creators} />
            <EventsWidget events={displayEventList}></EventsWidget>
          </div>
        </main>
      </div>
    </div>
  );
}
