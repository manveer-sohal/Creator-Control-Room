"use client";

import TestAuth from "../components/testAuth";
import { useRouter } from "next/navigation";
export default function StreamerAuth() {
  const router = useRouter();
  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4"
      style={{ backgroundImage: "url('/auth-background.png')" }}
    >
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 bg-amber-300"
      >
        {"<-"}
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Streamer Sign On</h1>
        <div className="mx-auto mb-6 h-48 w-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
          QR Code Placeholder
        </div>
        <TestAuth />
      </div>
    </div>
  );
}
