"use client";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import GenerateEvent from "./components/generateEvents";
import BitsWidget from "./components/widgets/bitsWidget";
import CheerWidget from "./components/widgets/cheerWidget";
import CreatorsLive from "./components/widgets/creatorsLive";
import EventsWidget from "./components/widgets/eventsWidget";
import GiftedWidget from "./components/widgets/giftedWidget";
// import JoinsWidget from "./components/widgets/joins24Widget";
import NewFollowerWidget from "./components/widgets/newFollowersWidget";
// import RaidWidget from "./components/widgets/raidWidget";
import SubsWidget from "./components/widgets/subsWidget";
import { UniqueViewsChart } from "./components/uniqueViewsChart";
import TestAuth from "./components/testAuth";
// import { EventV2 } from "../types";
// import { EventsWidgetProps } from "../types";
import { EventObj, EventPayload } from "../types";

declare global {
  // extend the global scope for dev/HMR
  var __SOCKET__: Socket | undefined;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);

  const [displayEventList, setDisplayEventList] = useState<EventObj[]>([]);
  const [allEvents, setAllEvents] = useState<Record<string, EventObj[]>>({});
  // const [newFollowEvents, setNewFollowEvents] = useState<EventObj[]>([]);
  // const [newBitsEvents, setNewBitsEvents] = useState<EventObj[]>([]);
  // const [newRaidEvents, setNewRaidEvents] = useState<EventObj[]>([]);
  // const [newCheerEvents, setNewCheerEvents] = useState<EventObj[]>([]);
  // const [newSubEvents, setNewSubEvents] = useState<EventObj[]>([]);
  // const [newGiftedEvents, setNewGiftedEvents] = useState<EventObj[]>([]);
  const [widgets, setWidgets] = useState<Record<string, boolean>>({
    cheer: true,
    raid: true,
    bits: true,
    subscribe: true,
    gift: true,
    follow: true,
  });

  const creators = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Crazy1Prabh", logo: "/vercel.svg" },
    { id: 2, name: "JasonTheWeen", logo: "/vercel.svg" },
    { id: 3, name: "StableRonaldo", logo: "/vercel.svg" },
    { id: 4, name: "Sukura", logo: "/vercel.svg" },
  ];

  // ON HOIST USE EFFECT
  useEffect(() => {
    console.log(widgets.cheer);
    if (!globalThis.__SOCKET__) {
      globalThis.__SOCKET__ = io("http://localhost:3001", {
        transports: ["websocket", "polling"],
      });
    }
    const s = globalThis.__SOCKET__;
    socketRef.current = s;

    // ******SOCKET FUNCTIONS*****
    // NEW EVENT
    const onEvent = (event: EventObj) => {
      console.log(event);

      setAllEvents((prev) => ({
        ...prev,
        [event.type]: [event, ...(prev[event.type] || [])],
      }));
      setDisplayEventList((prev) => [event, ...prev]);
    };

    // SOCKET CONNECTIONS

    s.on("Event", onEvent);

    //DISCONNECT SOCKETS
    return () => {
      s.off("Event", onEvent);

      s.disconnect();
      console.log(socketRef.current);
      socketRef.current = null;
    };
  }, []);

  // GENERATE AN EVENT REQUEST
  const generateTheEvent = (dataFromChild: EventPayload) => {
    socketRef.current?.emit("Event", dataFromChild);
  };

  const widgetStateChange = ({
    widgetName,
    widgetState,
  }: {
    widgetName: string;
    widgetState: boolean;
  }) => {
    console.log(widgetName, widgetState);
    setWidgets((prev) => ({
      ...prev,
      [widgetName]: widgetState,
    }));
  };

  return (
    // Shell controls height + scrolling behavior
    <div className="grid grid-rows-[auto_1fr] h-[100svh] overflow-hidden text-white">
      {/* Header row */}
      <header className="sticky top-0 h-14 z-50">
        <NavBar />
      </header>

      {/* Content row: 3 columns */}
      <div className="grid min-h-0 grid-cols-[16rem_1fr_18rem]">
        {/* Left column (sidebar): fixed width */}
        <aside className="min-h-0 overflow-y-auto">
          <SideBar onAction={widgetStateChange}></SideBar>
          <GenerateEvent onAction={generateTheEvent}></GenerateEvent>
          <TestAuth></TestAuth>
        </aside>

        {/* Right column (main): takes remaining space, scrolls */}
        <main className="min-w-0 overflow-y-auto pl-0.5 pt-4.5 gap-1">
          <div className="grid-rows-[auto_auto_auto]">
            <div className="grid min-h-0 grid-cols-[auto_auto_auto] gap-0.5">
              <CreatorsLive creators={creators} />
              <GiftedWidget
                onAction={widgetStateChange}
                events={allEvents["gift"] || []}
                show={widgets.gift}
              />
              <CheerWidget
                onAction={widgetStateChange}
                events={allEvents["cheer"] || []}
                show={widgets.cheer}
              />
            </div>
            <div className="grid min-h-0 grid-cols-[auto_auto_auto] gap-0.5">
              <SubsWidget
                onAction={widgetStateChange}
                events={allEvents["subscribe"] || []}
                show={widgets.subscribe}
              ></SubsWidget>
              <BitsWidget
                onAction={widgetStateChange}
                events={allEvents["bits"] || []}
                show={widgets.bits}
              ></BitsWidget>
              <NewFollowerWidget
                onAction={widgetStateChange}
                events={allEvents["follow"] || []}
                show={widgets.follow}
              ></NewFollowerWidget>
              {/* <RaidWidget events={newRaidEvents}></RaidWidget> */}
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
