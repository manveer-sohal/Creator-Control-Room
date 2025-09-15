import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { CreatorInfo } from "../../types";

import React, { useState } from "react";
interface ChildComponentProps {
  creators: Record<string, CreatorInfo>;
  onAction: ({
    widgetName,
    widgetState,
  }: {
    widgetName: string;
    widgetState: boolean;
  }) => void;
  onActionFilter: (name: string) => void;
}

function SideBar({ creators, onAction, onActionFilter }: ChildComponentProps) {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [creatorDropdown, setCreatorDropdown] = useState<boolean>(false);

  const router = useRouter();
  const params = useSearchParams();
  const company_id = params.get("company_id");
  const company_name = params.get("company_name");

  const itemClicked = (widgetName: string) => {
    onAction({ widgetName: widgetName, widgetState: true });
  };

  const creatorClicked = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    onActionFilter((event.target as HTMLElement).id);
  };

  return (
    <div className="bg-[var(--widget)] grid grid-cols-auto auto-rows-min shrink-0 h-full py-7">
      <button
        className="h-10 text-sm rounded-[5px] hover:bg-[var(--hover)] active:bg-[var(--button)] align-middle font-semibold "
        onClick={() => {
          router.push(
            `/streamerAuth?company_id=${company_id}&company_name=${company_name}`
          );
        }}
      >
        Add Creator +
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
        Add Widget +
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
              data-testid="add me"
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

      <button
        onClick={() => setCreatorDropdown(!creatorDropdown)}
        className={`h-10 text-sm font-semibold align-middle rounded-[5px] transition ${
          dropdown
            ? "bg-[var(--button)]"
            : "bg-[var(--widget)] hover:bg-[var(--hover)]"
        } `}
      >
        {" "}
        Filter Creator V
      </button>
      {creatorDropdown && (
        <div className=" w-full origin-top-right rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1 text-center">
            {Object.keys(creators).map((name, id) => {
              return (
                <a
                  key={id}
                  id={name}
                  onClick={(event) => creatorClicked(event)}
                  href="#"
                  className="block px-4 py-2 text-sm  hover:bg-[var(--hover)]"
                >
                  {name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;
