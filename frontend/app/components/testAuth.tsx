import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TestAuthInner() {
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

  return (
    <div className="align-middle">
      <button
        className="p-6 bg-[var(--button)]"
        onClick={() => {
          window.location.assign(uri);
        }}
      >
        Click to Authenticate
      </button>
    </div>
  );
}

export default function TestAuth() {
  return (
    <Suspense fallback={null}>
      <TestAuthInner />
    </Suspense>
  );
}
