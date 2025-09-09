"use client";

import LoginWidget from "../components/loginWidget";
export default function Login() {
  return (
    <>
      <link
        href="https://cdn.boxicons.com/fonts/basic/boxicons.min.css"
        rel="stylesheet"
      ></link>

      <div className="bg-black p-1.5 align-middle">
        <LoginWidget />
      </div>
    </>
  );
}
