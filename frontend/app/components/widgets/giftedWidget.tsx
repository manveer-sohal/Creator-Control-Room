import EventsNoti from "./../eventsNoti";
import { EventObj } from "../../../types";
import { useState } from "react";

interface EventsWidgetProps {
  events: EventObj[];
  show: boolean;
  onAction: ({
    widgetName,
    widgetState,
  }: {
    widgetName: string;
    widgetState: boolean;
  }) => void; // Defines 'onAction' as a function that takes a string and returns void
}

export default function GiftedWidget({
  events,
  show,
  onAction,
}: EventsWidgetProps) {
  const [minimize, setMinimize] = useState(false);

  const widgetClicked = () => {
    console.log("WIDGET SET TO DELETE");
    onAction({ widgetName: "gift", widgetState: false });
  };

  return (
    <>
      {show && (
        <div className="basis-1/4 grow h-64 grid grid-rows-[auto_1fr] gap-0.5">
          <div className="bg-[#26262b] flex justify-between w-full p-2 max-h-10">
            <div className="flex gap-0.5">
              <p className="font-bold">Gifted Feed</p>
              <button
                className=" hover:bg-gray-500 px-2 rounded-4xl transition"
                onClick={() => setMinimize(!minimize)}
              >
                v
              </button>
            </div>
            <button
              data-testid="delete me"
              className="bg-[var(--button)] hover:bg-violet-500 px-3 rounded transition"
              onClick={widgetClicked}
            >
              delete
            </button>
          </div>

          {!minimize && (
            <div className="bg-[#18181b] h-full overflow-y-auto grid grid-cols-1 auto-rows-min gap-1 pl-1 pr-1">
              {events.map((event, id) => {
                return <EventsNoti key={id} {...event}></EventsNoti>;
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}
