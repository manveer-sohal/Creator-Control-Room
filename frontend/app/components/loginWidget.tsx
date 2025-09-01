// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import { useState } from "react";

export default function LoginWidget() {
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logo, setLogo] = useState<File | null>();

  const validateName = () => {
    console.log(companyName);
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        id="form"
        className="w-80 p-6 bg-indigo-200 rounded-lg shadow-md space-y-4"
        onSubmit={validateName}
      >
        {/* Company Name */}
        <label className="block bg">
          <span className="block mb-1 font-medium">Company Name</span>
          <input
            onChange={(e) => setCompanyName(e.target.value)}
            className="bg-white w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="text"
            placeholder=" eg. Creator Control Room"
            required
          />
        </label>

        {/* Password */}
        <label className="block">
          <span className="block mb-1 font-medium">Password</span>
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Enter password"
            required
          />
        </label>

        {/* Submit */}
        <button
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
          type="submit"
        >
          Log in
        </button>
        <button
          className="w-full py-2 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-700 transition"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
