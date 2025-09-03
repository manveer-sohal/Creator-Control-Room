import React, { useEffect, useState } from "react";
import Image from "next/image";
type creatorNmae = {
  creator: {
    // id: number;
    name: string;
    logo: string;
  };
};

function LiveCreator({ creator }: creatorNmae) {
  return (
    <>
      <div className="flex bg-[#18181b] border-b-1 border-gray-500 h-12 top-0 z-10 gap-2 pt-3 pb-4">
        <Image
          src={creator.logo}
          alt={`${creator.name} logo`}
          width={30}
          height={30}
        />
        <p>{creator.name} is live</p>
      </div>
    </>
  );
}

export default LiveCreator;
