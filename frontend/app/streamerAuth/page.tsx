"use client";
import Image from "next/image";
import TestAuth from "../components/testAuth";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function StreamerAuth() {
  return (
    <Suspense fallback={<div />}>
      <StreamerAuthClient />
    </Suspense>
  );
}

function StreamerAuthClient() {
  const router = useRouter();
  const params = useSearchParams();

  const company_id = params.get("company_id") ?? "";
  const company_name = params.get("company_name") ?? "";

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
  const NEXT_PUBLIC_AUTH_REDIRECT_URI =
    process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI ?? "";
  const NEXT_PUBLIC_RESPONSE_TYPE =
    process.env.NEXT_PUBLIC_RESPONSE_TYPE ?? "code";

  const state = encodeURIComponent(`${company_id}|${company_name}`);
  const redirect = encodeURIComponent(NEXT_PUBLIC_AUTH_REDIRECT_URI);
  const uri = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=${NEXT_PUBLIC_RESPONSE_TYPE}&state=${state}`;

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(
    uri
  )}`;
  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4"
      style={{ backgroundImage: "url('/auth-background.png')" }}
    >
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 p-2 bg-[var(--button)]"
      >
        {"<-"}
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Streamer Sign On</h1>
        <p className="text-sm mb-6">
          Scan the QR code or click the button to authenticate with Twitch
        </p>
        <a
          href={uri}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto mb-6 h-48 w-48 block"
        >
          <Image
            src={qrSrc}
            alt="Scan to authenticate with Twitch"
            className="h-48 w-48 rounded-md"
            width={192}
            height={192}
          />
        </a>
        <TestAuth />
      </div>
    </div>
  );
}
