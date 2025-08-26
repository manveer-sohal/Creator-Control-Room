import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LiveCreator from "./liveCreator";

function SideBar() {
  const [liveCount, setLiveCount] = useState<number>(0);
  const count = 4;

  const creatorList = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Prabhdeep", logo: "/vercel.svg" },
  ];

  return (
    <div className="bg-[var(--widget)] shrink-0 h-full ">
      <p className="p-4 font-semibold">Sidebar</p>
      <button className="p-4 font-semibold"> click me </button>
      <button className="p-4 font-semibold"> click me </button>
      <button className="p-4 font-semibold"> click me </button>
    </div>
  );
}

export default SideBar;
