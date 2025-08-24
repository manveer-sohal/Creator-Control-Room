import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LiveCreator from "./liveCreator";

function CreatorsLive() {
  const [liveCount, setLiveCount] = useState<number>(0);
  const count = 4;

  const creatorList = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Prabhdeep", logo: "/vercel.svg" },
  ];

  return (
    <div className="bg-indigo-200 w-56 h-56 gap-3">
      <p>Number of creators live: {liveCount}</p>

      {creatorList.map((creator) => {
        return <LiveCreator key={creator.id} creator={creator}></LiveCreator>;
      })}
    </div>
  );
}

export default CreatorsLive;
