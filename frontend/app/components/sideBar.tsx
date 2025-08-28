import React, { useState } from "react";
interface ChildComponentProps {
  onAction: ({
    widgetName,
    widgetState,
  }: {
    widgetName: string;
    widgetState: boolean;
  }) => void;
}

function SideBar({ onAction }: ChildComponentProps) {
  const [dropdown, setDropdown] = useState<boolean>(false);

  const itemClicked = (widgetName: string) => {
    onAction({ widgetName: widgetName, widgetState: true });
  };

  return (
    <div className="bg-[var(--widget)] grid grid-cols-auto auto-rows-min shrink-0 h-full">
      <p className="p-4 font-semibold">Sidebar</p>
      <button className="h-10 text-sm rounded-[5px] hover:bg-[var(--hover)] active:bg-[var(--button)] align-middle font-semibold ">
        clidck me
      </button>
      <button className="h-10 text-sm hover:bg-[var(--hover)] active:bg-[var(--button)]  align-middle font-semibold rounded-[5px]">
        click me{" "}
      </button>
      <button
        onClick={() => setDropdown(!dropdown)}
        className={`h-10 text-sm font-semibold align-middle rounded-[5px] transition ${
          dropdown
            ? "bg-[var(--button)]"
            : "bg-[var(--widget)] hover:bg-[var(--hover)]"
        } `}
      >
        {" "}
        Add Widget
      </button>
      {dropdown && (
        <div className=" w-full origin-top-right rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1 text-center">
            {" "}
            {/* text-center applied here */}
            <a
              onClick={() => itemClicked("cheer")}
              href="#"
              className="block px-4 py-2 text-sm  hover:bg-[var(--hover)]"
            >
              Add Cheer Widget
            </a>
            <a
              onClick={() => itemClicked("gift")}
              href="#"
              className="block px-4 py-2 text-sm  hover:bg-[var(--hover)]"
            >
              Add Gifted Widget
            </a>
            <a
              onClick={() => itemClicked("subscribe")}
              href="#"
              className="block px-4 py-2 text-sm  hover:bg-[var(--hover)]"
            >
              Add Subscriber Widget
            </a>
            <a
              onClick={() => itemClicked("bits")}
              href="#"
              className="block px-4 py-2 text-sm  hover:bg-[var(--hover)]"
            >
              Add Bits Widget
            </a>
            <a
              onClick={() => itemClicked("follow")}
              href="#"
              className="block px-4 py-2 text-sm  hover:bg-[var(--hover)]"
            >
              Add New Follower Widget
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;
