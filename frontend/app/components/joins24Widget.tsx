// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import EventsNoti from "./eventsNoti";
import { EventsWidgetProps } from "../../types";
// import { eventObj } from "../../types";

export default function JoinsWidget({ events }: EventsWidgetProps) {
  return (
    <div className="w-full h-full  grid grid-rows-[auto_1fr] gap-0.5">
      <div className="bg-[#26262b] p-2 max-h-10 ">
        <p className="font-bold">Joins Feed</p>
      </div>
      <div className="bg-[#18181b] h-full overflow-y-auto grid grid-cols-1 auto-rows-min gap-1 pl-1 pr-1">
        {events.map((event, id) => {
          return (
            <EventsNoti
              key={id}
              message_type={event.message_type}
              type={event.type}
            ></EventsNoti>
          );
        })}
      </div>
    </div>
  );
}
