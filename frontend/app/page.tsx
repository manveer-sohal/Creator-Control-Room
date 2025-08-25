"use client";

import Image from "next/image";
import CreatorsLive from "./components/creatorsLive";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";

export default function Home() {
  const creators = [
    { id: 0, name: "TheOneWhoThinks", logo: "/vercel.svg" },
    { id: 1, name: "Crazy1Prabh", logo: "/vercel.svg" },
    { id: 2, name: "JasonTheWeen", logo: "/vercel.svg" },
    { id: 3, name: "StableRonaldo", logo: "/vercel.svg" },
  ];

  return (
    // Shell controls height + scrolling behavior
    <div className="grid grid-rows-[auto_1fr] h-[100svh] overflow-hidden bg-amber-950 text-white">
      {/* Header row */}
      <header className="sticky top-0 h-14 z-50">
        <NavBar />
      </header>

      {/* Content row: 2 columns */}
      <div className="grid min-h-0 grid-cols-[16rem_1fr]">
        {/* Left column (sidebar): fixed width */}
        <aside className="min-h-0 overflow-y-auto">
          <SideBar />
        </aside>

        {/* Right column (main): takes remaining space, scrolls */}
        <main className="min-w-0 overflow-y-auto p-6 gap-4">
          <div className="grid min-h-0 grid-cols-[16rem_1fr]">
            <CreatorsLive creators={creators} />
          </div>
        </main>
      </div>
    </div>
  );
}
