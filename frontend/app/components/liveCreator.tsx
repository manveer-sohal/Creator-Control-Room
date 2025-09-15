import Image from "next/image";
import { CreatorInfo } from "../../types";

type creatorNmae = {
  creator: [string, CreatorInfo];
};

function LiveCreator({ creator }: creatorNmae) {
  return (
    <>
      <div className="flex bg-[#18181b] border-b-1 border-gray-500 h-12 top-0 z-10 gap-2 pt-3 pb-4">
        <Image
          src={creator[1].logo}
          alt={`${creator[0]} logo`}
          width={30}
          height={30}
        />
        <p>{creator[0]} is live</p>
      </div>
    </>
  );
}

export default LiveCreator;
