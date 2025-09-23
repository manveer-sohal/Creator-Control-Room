// StreamEmbed.jsx
type steaminfo = {
  platform: string;
  idOrChannel: string;
  parent?: string | string[];
};

function getEmbedParents(): string[] {
  if (typeof window !== "undefined") {
    return [window.location.hostname];
  } else if (process.env.NEXT_PUBLIC_EMBED_PARENTS) {
    return process.env.NEXT_PUBLIC_EMBED_PARENTS.split(",").map((p) =>
      p.trim()
    );
  } else {
    console.log("No embed parents found");
    return ["creator-control-room.vercel.app"];
  }
}

export default function StreamEmbed({
  platform,
  idOrChannel,
  parent,
}: steaminfo) {
  if (platform === "twitch") {
    const parents = parent
      ? Array.isArray(parent)
        ? parent
        : [parent]
      : getEmbedParents();
    const parentParams = parents.map((p) => `&parent=${p}`).join("");
    const src = `https://player.twitch.tv/?channel=${idOrChannel}${parentParams}&autoplay=false`;
    return (
      <div className="basis-1/2 grow h-78 aspect-video">
        <div className="bg-[#26262b] flex justify-between w-full p-2 max-h-10">
          <p className="font-bold">Stream Preview For {idOrChannel}</p>
        </div>
        <iframe className="w-full h-68" src={src} allowFullScreen />
      </div>
    );
  }
  if (platform === "youtube") {
    const src = `https://www.youtube.com/embed/${idOrChannel}?autoplay=0&modestbranding=1&rel=0`;
    return (
      <div className="w-full aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={src}
          title="YouTube"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (platform === "kick") {
    const src = `https://player.kick.com/${idOrChannel}`;
    return (
      <div className="w-full aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={src}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return null;
}
