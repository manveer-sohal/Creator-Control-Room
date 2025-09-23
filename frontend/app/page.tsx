"use client";
import { useRouter, useSearchParams } from "next/navigation";

import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";
import { useEffect, useRef, useState, Suspense } from "react";
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

/**
 * Page wrapper:
 * Wrap the client sub-component that uses `useSearchParams()` in <Suspense>
 */
export default function Home() {
  return (
    <Suspense fallback={<div />}>
      <HomeClient />
    </Suspense>
  );
}

/**
 * Client sub-component containing the original logic.
 */
function HomeClient() {
  // Env vars
  const BACKEND_ENDPOINT =
    process.env.NEXT_PUBLIC_BACKEND_CLOUD_RUN_ENDPOINT ||
    "http://localhost:3000";

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

  // ON HOIST USE EFFECT
  useEffect(() => {
    if (!company_id) {
      router.push(`/login`);
    } else {
      const loadEvets = async () => {
        const response = await fetch(`${BACKEND_ENDPOINT}/db/events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_id: company_id }),
        });

        const data = await response.json();

        return data;
      };

      const loadCreatorData = async () => {
        const response_creators_data = await fetch(
          `${BACKEND_ENDPOINT}/db/get_creators`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_id: company_id }),
          }
        );
        const data = await response_creators_data.json();
        return data;
      };

      const loadLogo = async () => {
        const response_logo_data = await fetch(
          `${BACKEND_ENDPOINT}/db/company/logo`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ company_name: company_name }),
          }
        );
        const data = await response_logo_data.json();
        return data;
      };

      // UPDATE: Turn this into a get and have data be in the endpoint
      const loadInitalData = async () => {
        setIsLoaded(true);
        console.log("loading data for ", company_name);

        const creators_data = await loadCreatorData();
        console.log(creators_data);
        setCreators(creators_data);

        const logo_data = await loadLogo();
        setLogoData(logo_data.url);

        const events_data = await loadEvets();

        if (events_data.res) {
          console.log(events_data);
        }
        console.log(events_data);
        for (const i in events_data) {
          setAllEvents((prev) => ({
            ...prev,
            [events_data[i].type]: [
              events_data[i],
              ...(prev[events_data[i].type] || []),
            ],
          }));
          setDisplayEventList((prev) => [events_data[i], ...prev]);
        }
      };
      if (!isLoaded) {
        loadInitalData();
      }
    }
  }, [BACKEND_ENDPOINT, company_id, company_name, isLoaded, router]);

  useEffect(() => {
    if (!globalThis.__SOCKET__) {
      globalThis.__SOCKET__ = io(
        "https://creatorcontrolroom-645759902036.northamerica-northeast1.run.app",
        {
          transports: ["websocket", "polling"],
        }
      );
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

    // DISCONNECT SOCKETS
    return () => {
      s.off("Event", onEvent);

      s.disconnect();
      console.log(socketRef.current);
      socketRef.current = null;
    };
  }, [company_id]);

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

  //need to finish this
  async function filterCreator(name: string) {
    console.log(creators[name]);

    // const response = await fetch("", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ company_name: company_name }),
    // });
    // const data = await response.json();

    // for (const i in data) {
    //   setAllEvents((prev) => ({
    //     ...prev,
    //     [data[i].type]: [data[i], ...(prev[data[i].type] || [])],
    //   }));
    //   setDisplayEventList((prev) => [data[i], ...prev]);
    // }
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
                  <StreamEmbed
                    platform="twitch"
                    idOrChannel="theonewhothinks"
                    parent="localhost"
                  />
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
