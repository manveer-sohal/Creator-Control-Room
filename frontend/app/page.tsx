"use client";

import Image from "next/image";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";
import react, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import GenerateEvent from "./components/generateEvents";
import CreatorsLive from "./components/widgets/creatorsLive";
import EventsWidget from "./components/widgets/eventsWidget";
import GiftedWidget from "./components/widgets/giftedWidget";
import JoinsWidget from "./components/widgets/joins24Widget";
import NewFollowerWidget from "./components/widgets/newFollowersWidget";
import RaidWidget from "./components/widgets/raidWidget";
import SubsWidget from "./components/widgets/subsWidget";
import { UniqueViewsChart } from "./components/uniqueViewsChart";

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
  const [newFollowEvents, setNewFollowEvents] = useState<eventObj[]>([]);
  const [newBitsEvents, setNewBitsEvents] = useState<eventObj[]>([]);
  const [newRaidEvents, setNewRaidEvents] = useState<eventObj[]>([]);
  const [newCheerEvents, setNewCheerEvents] = useState<eventObj[]>([]);
  const [newSubEvents, setNewSubEvents] = useState<eventObj[]>([]);
  const [newGiftedEvents, setNewGiftedEvents] = useState<eventObj[]>([]);

  const creators = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Crazy1Prabh", logo: "/vercel.svg" },
    { id: 2, name: "JasonTheWeen", logo: "/vercel.svg" },
    { id: 3, name: "StableRonaldo", logo: "/vercel.svg" },
    { id: 4, name: "Sukura", logo: "/vercel.svg" },
  ];

  // ON HOIST USE EFFECT
  useEffect(() => {
    if (!globalThis.__SOCKET__) {
      globalThis.__SOCKET__ = io("http://localhost:3001", {
        transports: ["websocket", "polling"],
      });
    }
    const s = globalThis.__SOCKET__;
    socketRef.current = s;

    // ******SOCKET FUNCTIONS*****

    // NEW EVENT
    const onEvent = (event: eventObj) => {
      // FOLLOW
      if (event.type == "channel.follow") {
        setNewFollowEvents((prev) => [event, ...prev]);
      }
      if (event.type == "channel.subscribe") {
        setNewSubEvents((prev) => [event, ...prev]);
      }
      if (event.type == "channel.cheer") {
        setNewCheerEvents((prev) => [event, ...prev]);
      }
      if (event.type == "channel.bits.use") {
        setNewBitsEvents((prev) => [event, ...prev]);
      }
      if (event.type == "channel.raid") {
        setNewRaidEvents((prev) => [event, ...prev]);
      }
      if (event.type == "channel.subscription.gift") {
        setNewGiftedEvents((prev) => [event, ...prev]);
      }
      setDisplayEventList((prev) => [event, ...prev]);
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
              <GiftedWidget events={newGiftedEvents}> </GiftedWidget>
            </div>
            <div className="grid min-h-0 grid-cols-[auto_auto_auto] gap-0.5">
              <SubsWidget events={newSubEvents}></SubsWidget>
              <CreatorsLive creators={creators} />
              <NewFollowerWidget events={newFollowEvents}></NewFollowerWidget>
            </div>
            <UniqueViewsChart></UniqueViewsChart>
          </div>
        </main>
        <aside className="min-h-0 overflow-y-auto pl-0.5 pt-4.5">
          <EventsWidget events={displayEventList}></EventsWidget>
        </aside>
      </div>
      <div></div>
    </div>
  );
}
