// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export default function Login() {
  const [companyName, setCompanyName] = useState<string>("");

  const validateName = () => {
    console.log(companyName);
  };
  return (
    <div className="align-middle">
      <form id="form" className="w-64 h-full p-6 bg-[var(--muted)]">
        <label>
          Enter your Company Name:{" "}
          <input
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full h-full p-6 bg-[var(--button)]"
            type="text"
          />
        </label>
        <br />
        <br />
        <button
          onClick={validateName}
          className="bg-[var(--button)]"
          type="submit"
        >
          Log in
        </button>
      </form>
      <button
        className="p-6 bg-[var(--button)]"
        onClick={() => {
          window.location.href = process.env.NEXT_PUBLIC_TWITCH_AUTH_URI!;
        }}
      >
        Test Auth Event
      </button>
    </div>
  );
}
