import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LiveCreator from "./liveCreator";

// List of creators currently live
type creatorList = {
  creators: {
    id: number;
    name: string;
    logo: string;
  }[];
};

function CreatorsLive({ creators }: creatorList) {
  const [liveCount, setLiveCount] = useState<number>(0);

  // Updates liveCount when creators prop changes
  useEffect(() => {
    setLiveCount(creators.length);
  }, [creators]);

  return (
    <div className="bg-indigo-200 w-64 h-56 grid grid-cols-1 gap-1">
      <p>Number of creators live: {liveCount}</p>
      {creators.map((creator) => {
        return <LiveCreator key={creator.id} creator={creator}></LiveCreator>;
      })}
    </div>
  );
}

export default CreatorsLive;
