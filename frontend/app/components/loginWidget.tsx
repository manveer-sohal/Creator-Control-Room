// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginWidget() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [incorrectLogin, setIncorrectLogin] = useState<boolean>(false);

  const submitForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(companyName);

    // POST SIGN UP INFORMATION
    const response = await fetch(
      "https://a0c2b18f2a76.ngrok-free.app/db/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          plainPassword: password,
        }),
      }
    );

    // ONCE SIGN UP COMPLETE PUSH USER TO DASHBOARD (LOOK INTO JWT TOKEN AND VALADATING)
    const data = await response.json();
    console.log(data);
    if (data.res == 401) {
      console.log("Incorrect login");
      setIncorrectLogin(true);
    } else {
      const company_id = data.data.id;
      const company_name = data.data.name;

      if (company_id) {
        // Redirect with company_id in the URL
        router.push(`/?company_id=${company_id}&company_name=${company_name}`);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        id="form"
        className="w-80 p-6 bg-indigo-200 rounded-lg shadow-md space-y-4"
        onSubmit={submitForm}
      >
        {/* Login Error */}
        {incorrectLogin && (
          <p>
            Incorrect Login information. Either your comapny name or password is
            wrong.
          </p>
        )}
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
          onClick={() => {
            router.push(`/signup`);
          }}
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
