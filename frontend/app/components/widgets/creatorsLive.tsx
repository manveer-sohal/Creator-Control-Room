import React, { useEffect, useState } from "react";
import LiveCreator from "../liveCreator";

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
    <div className="w-full h-64 grid grid-rows-[auto_1fr] gap-0.5">
      <div className="bg-[#26262b] p-2 max-h-10 ">
        <p className="font-bold ">Number of creators live: {liveCount}</p>
      </div>
      <div className="bg-[#18181b] h-full overflow-y-auto grid grid-cols-1 auto-rows-min gap-1 pl-1 pr-1">
        {creators.map((creator) => {
          return <LiveCreator key={creator.id} creator={creator}></LiveCreator>;
        })}
      </div>
    </div>
  );
}

export default CreatorsLive;
