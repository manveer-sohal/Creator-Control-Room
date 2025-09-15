import React, { useEffect, useState } from "react";
import LiveCreator from "../liveCreator";
import { CreatorInfo } from "../../../types";

interface creatorProp {
  creators: Record<string, CreatorInfo>;
}
function CreatorsLive({ creators }: creatorProp) {
  const [liveCount, setLiveCount] = useState<number>(0);

  // Updates liveCount when creators prop changes
  useEffect(() => {
    if (creators) {
      setLiveCount(Object.keys(creators).length);
    } else {
      setLiveCount(0);
    }
  }, [creators]);

  return (
    <div className="basis-1/4 grow h-78 grid grid-rows-[auto_1fr] gap-0.5">
      <div className="bg-[#26262b] p-2 max-h-10 ">
        <p className="font-bold ">Number of creators live: {liveCount}</p>
      </div>
      <div className="bg-[#18181b] h-full overflow-y-auto grid grid-cols-1 auto-rows-min gap-1 pl-1 pr-1">
        {creators
          ? Object.entries(creators).map(([name, info], id) => {
              return (
                <LiveCreator key={id} creator={[name, info]}></LiveCreator>
              );
            })
          : []}
      </div>
    </div>
  );
}

export default CreatorsLive;
