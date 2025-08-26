"use client";

import Image from "next/image";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";
import react, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import GenerateEvent from "./components/generateEvents";
import EventsWidget from "./components/eventsWidget";
import SubsWidget from "./components/subsWidget";
import CreatorsLive from "./components/creatorsLive";
import TipsWidget from "./components/tipsWidget";
import NewFollowerWidget from "./components/newFollowersWidget";

import { EventPayload } from "./../types";

// import { EventV2 } from "../types";
// import { EventsWidgetProps } from "../types";
import { eventObj } from "../types";

declare global {
  // extend the global scope for dev/HMR
  var __SOCKET__: Socket | undefined;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [displayEventList, setDisplayEventList] = useState<eventObj[]>([]);

  const creators = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Crazy1Prabh", logo: "/vercel.svg" },
    { id: 2, name: "JasonTheWeen", logo: "/vercel.svg" },
    { id: 3, name: "StableRonaldo", logo: "/vercel.svg" },
    { id: 4, name: "Sukura", logo: "/vercel.svg" },
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
      s.off("Event", onEvent);

      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  // GENERATE AN EVENT REQUEST
  const generateTheEvent = (dataFromChild: EventPayload) => {
    socketRef.current?.emit("Event", dataFromChild);
  };

  return (
    // Shell controls height + scrolling behavior
    <div className="grid grid-rows-[auto_1fr] h-[100svh] overflow-hidden text-white">
      {/* Header row */}
      <header className="sticky top-0 h-14 z-50">
        <NavBar />
      </header>

      {/* Content row: 2 columns */}
      <div className="grid min-h-0 grid-cols-[16rem_1fr_18rem]">
        {/* Left column (sidebar): fixed width */}
        <aside className="min-h-0 overflow-y-auto">
          <SideBar />
          <GenerateEvent onAction={generateTheEvent}></GenerateEvent>
        </aside>

        {/* Right column (main): takes remaining space, scrolls */}
        <main className="min-w-0 overflow-y-auto pl-0.5 pt-4.5 gap-1">
          <div className="grid-rows-[auto_auto_auto]">
            <div className="grid min-h-0 grid-cols-[auto_auto_auto] gap-0.5">
              <CreatorsLive creators={creators} />
              <EventsWidget events={displayEventList}></EventsWidget>
              <TipsWidget events={displayEventList}></TipsWidget>
            </div>
            <div className="grid min-h-0 grid-cols-[auto_auto_auto] gap-0.5">
              <SubsWidget events={displayEventList}></SubsWidget>
              <CreatorsLive creators={creators} />
              <NewFollowerWidget events={displayEventList}></NewFollowerWidget>
            </div>
          </div>
        </main>
        <aside className="min-h-0 overflow-y-auto pl-0.5 pt-4.5">
          <EventsWidget events={displayEventList}></EventsWidget>
        </aside>
      </div>
    </div>
  );
}
