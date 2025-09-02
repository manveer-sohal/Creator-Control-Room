import EventsNoti from "./../eventsNoti";
import { EventObj } from "../../../types";

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
  const widgetClicked = () => {
    console.log("WIDGET SET TO DELETE");
    onAction({ widgetName: "gift", widgetState: false });
  };

  return (
    <>
      {show && (
        <div className="w-full h-64 grid grid-rows-[auto_1fr] gap-0.5">
          <div className="bg-[#26262b] flex justify-between w-full p-2 max-h-10">
            <p className="font-bold">Gifted Feed</p>
            <button
              className="bg-[var(--button)] hover:bg-violet-500 px-3 rounded transition"
              onClick={widgetClicked}
            >
              delete
            </button>
          </div>

          <div className="bg-[#18181b] h-full overflow-y-auto grid grid-cols-1 auto-rows-min gap-1 pl-1 pr-1">
            {events.map((event, id) => {
              return <EventsNoti key={id} {...event}></EventsNoti>;
            })}
          </div>
        </div>
      )}
    </>
  );
}
