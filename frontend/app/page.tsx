"use client";
import { useRouter, useSearchParams } from "next/navigation";

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
import { EventObj, EventPayload, CreatorInfo } from "../types";
import StreamEmbed from "./components/widgets/streamEmbed";
declare global {
  // extend the global scope for dev/HMR
  var __SOCKET__: Socket | undefined;
}

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const params = useSearchParams();
  const company_id = params.get("company_id");
  const company_name = params.get("company_name");
  const router = useRouter();

  const [logoData, setLogoData] = useState<string>("");

  const [displayEventList, setDisplayEventList] = useState<EventObj[]>([]);
  const [allEvents, setAllEvents] = useState<Record<string, EventObj[]>>({});
  const [creators, setCreators] = useState<Record<string, CreatorInfo>>({});

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<Record<string, boolean>>({
    cheer: true,
    raid: true,
    bits: true,
    subscribe: true,
    gift: true,
    follow: true,
  });

  // const fetchData = useCallback(async () => {
  //   console.log("fire");
  //   const response = await fetch(
  //     "https://a0c2b18f2a76.ngrok-free.app/db/events",
  //     {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ hi: "hello" }),
  //     }
  //   );
  //   console.log("show");

  //   const data = await response.json();
  //   console.log(data);
  //   setAllEvents((prev) => ({
  //     ...prev,
  //     [data.type]: [data, ...(prev[data.type] || [])],
  //   }));
  // }, [setAllEvents]);

  // ON HOIST USE EFFECT
  useEffect(() => {
    if (!company_id) {
      router.push(`/login`);
    } else {
      // UPDATE: Turn this into a get and have data be in the endpoint
      const loadInitalData = async () => {
        const response = await fetch(
          "https://a0c2b18f2a76.ngrok-free.app/db/events",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_id: company_id }),
          }
        );

        const response_creators_data = await fetch(
          "https://a0c2b18f2a76.ngrok-free.app/db/get_creators",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_id: company_id }),
          }
        );
        const creators_data = await response_creators_data.json();
        console.log(creators_data);
        setCreators(creators_data);

        const response_logo_data = await fetch(
          "https://a0c2b18f2a76.ngrok-free.app/db/company/logo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_name: company_name }),
          }
        );
        console.log(company_name);
        const logo_data = await response_logo_data.json();
        setLogoData(logo_data.url);

        const data = await response.json();
        if (data.res) {
          console.log(data);
        }
        console.log(data);
        for (const i in data) {
          setAllEvents((prev) => ({
            ...prev,
            [data[i].type]: [data[i], ...(prev[data[i].type] || [])],
          }));
          setDisplayEventList((prev) => [data[i], ...prev]);
        }

        setIsLoaded(true);
      };
      if (!isLoaded) {
        loadInitalData();
      }
    }

    if (!globalThis.__SOCKET__) {
      globalThis.__SOCKET__ = io("http://localhost:3001", {
        transports: ["websocket", "polling"],
      });
    }
    const s = globalThis.__SOCKET__;
    socketRef.current = s;

    socketRef.current.emit("joinCompany", company_id);

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
  }, [isLoaded, company_id, company_name, router]);

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
    setWidgets((prev) => ({
      ...prev,
      [widgetName]: widgetState,
    }));
  };
  async function filterCreator(name: string) {
    console.log(creators[name]);

    const response = await fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name: company_name }),
    });
    const data = await response.json();

    for (const i in data) {
      setAllEvents((prev) => ({
        ...prev,
        [data[i].type]: [data[i], ...(prev[data[i].type] || [])],
      }));
      setDisplayEventList((prev) => [data[i], ...prev]);
    }
  }

  return (
    <>
      {company_id && (
        // Shell controls height + scrolling behavior
        <div className="grid grid-rows-[auto_1fr] h-[100svh] overflow-hidden text-white">
          {/* Header row */}
          <header className="sticky top-0 h-12 z-50">
            <NavBar logourl={logoData} company_name={company_name} />
          </header>

          {/* Content row: 3 columns */}
          <div className="grid min-h-0 grid-cols-[13.5rem_1fr_15rem]">
            {/* Left column (sidebar): fixed width */}
            <aside className="min-h-0 overflow-y-auto">
              <SideBar
                creators={creators}
                onAction={widgetStateChange}
                onActionFilter={filterCreator}
              ></SideBar>
              <GenerateEvent onAction={generateTheEvent}></GenerateEvent>
              <TestAuth></TestAuth>
            </aside>

            {/* Right column (main): takes remaining space, scrolls */}
            <main className="min-w-0 overflow-y-auto pl-0.5 pt-4.5 gap-1">
              <div className="grid-rows-[auto_auto_auto]">
                <div className="flex flex-wrap gap-0.5 py-0.5">
                  {/* <StreamEmbed
                    platform="twitch"
                    idOrChannel="theonewhothinks"
                    parent="localhost"
                  /> */}
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
                  ></CheerWidget>
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
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-0.5">
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
      )}
    </>
  );
}
