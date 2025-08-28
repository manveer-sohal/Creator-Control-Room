// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export default function TestAuth() {
  //   const [broadcaster_user_name, setBroadcaster_user_name] = useState("");

  // ON CLICK SEND DATA TO THE ONACTION PROP
  //   const validateName = async (event: { preventDefault: () => void }) => {
  //     event.preventDefault();
  //     console.log("fire");
  //     const response = await fetch(
  //       "https://a0c2b18f2a76.ngrok-free.app/validate_username",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ broadcaster_user_name: broadcaster_user_name }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log(data);

  //     if (data.status == 200) {
  //       console.log("Valid User Name");
  //       setActivateButton(true);
  //     }
  //   };

  //   const generateEvent = async (event: { preventDefault: () => void }) => {
  //     event.preventDefault();
  //     console.log("fire");
  //     window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=moderator:read:followers`;

  // const response = await fetch(
  //   "https://a0c2b18f2a76.ngrok-free.app/subscribe_to_follow",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ broadcaster_user_name: "theonewhothinks" }),
  //   }
  // );

  // console.log("response: ", response);
  //   };
  //`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=moderator:read:followers`

  return (
    <div className="align-middle">
      {" "}
      {/* <form id="form" className="w-64 h-full p-6 bg-[var(--muted)]">
        <label>
          Enter your Twitch username:{" "}
          <input
            onChange={(e) => setBroadcaster_user_name(e.target.value)}
            className="w-full h-full p-6 bg-[var(--button)]"
            type="text"
          />
        </label>
        <br />
        <br />
        <button
          onClick={(e) => validateName(e)}
          className="bg-[var(--button)]"
          type="submit"
        >
          Submit form
        </button>
      </form> */}
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
