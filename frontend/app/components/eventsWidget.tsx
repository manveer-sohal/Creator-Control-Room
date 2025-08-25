// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import EventsNoti from "./eventsNoti";
import { EventsWidgetProps } from "../../types";
// import { eventObj } from "../../types";

export default function EventsWidget({ events }: EventsWidgetProps) {
  return (
    <div className="bg-indigo-200 w-64 h-56 grid grid-cols-1 gap-1">
      <p>Events</p>
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
  );
}
