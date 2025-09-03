// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import { useSearchParams } from "next/navigation";

export default function TestAuth() {
  const params = useSearchParams();
  const company_id = params.get("company_id");
  const company_name = params.get("company_name");

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const NEXT_PUBLIC_AUTH_REDIRECT_URI =
    process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI;
  const NEXT_PUBLIC_RESPONSE_TYPE = process.env.NEXT_PUBLIC_RESPONSE_TYPE;
  const uri = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${NEXT_PUBLIC_AUTH_REDIRECT_URI}&response_type=${NEXT_PUBLIC_RESPONSE_TYPE}&state=${company_id}|${company_name}`;

  return (
    <div className="align-middle">
      {" "}
      <button
        className="p-6 bg-[var(--button)]"
        onClick={() => {
          window.location.href = `${uri}`!;
        }}
      >
        Test Auth Event
      </button>
    </div>
  );
}
