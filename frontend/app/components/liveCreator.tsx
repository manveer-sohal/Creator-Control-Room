import React, { useEffect, useState } from "react";
import Image from "next/image";
type creatorNmae = {
  creator: {
    id: number;
    name: string;
    logo: string;
  };
};

function LiveCreator({ creator }: creatorNmae) {
  const [creatorName, setCreatorName] = useState<string>("");

  return (
    <div className="bg-indigo-400 w-full h-10 top-0 z-10">
      <Image
        src={creator.logo}
        alt={`${creator.name} logo`}
        width={30}
        height={30}
      />
      <p>{creator.name} is live</p>
    </div>
  );
}

export default LiveCreator;
