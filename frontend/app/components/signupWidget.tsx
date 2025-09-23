// import { generateKey } from "crypto";
// import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupWidget() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logo, setLogo] = useState<File>();

  const validateName = async (event: { preventDefault: () => void }) => {
    console.log(logo);
    event.preventDefault();

    // PUT FILE INTO FORM FOR MUTLER UPLOAD
    const formData = new FormData();
    formData.append("name", companyName);
    formData.append("email", email);
    formData.append("plainPassword", password);
    if (logo) {
      formData.append("logo", logo, logo.name);
    }

    // POST SIGN UP INFORMATION
    const response = await fetch(
      "https://creatorcontrolroom-645759902036.northamerica-northeast1.run.app/db/add_user",
      {
        method: "POST",
        body: formData,
      }
    );

    // ONCE SIGN UP COMPLETE PUSH USER TO DASHBOARD (LOOK INTO JWT TOKEN AND VALADATING)
    const { company_id, company_name } = await response.json();

    if (company_id) {
      // Redirect with company_id in the URL
      router.push(`/?company_id=${company_id}&company_name=${company_name}`);
    }
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

        {/* Email */}
        <label className="block">
          <span className="block mb-1 font-medium">Email</span>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            placeholder="eg. email@email.com"
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

        {/* Image */}
        <label className="block">
          <span className="block mb-1 font-medium">Company Logo</span>

          {/* Hidden native file input */}
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0])}
            className="hidden"
            required
          />

          {/* Custom styled button */}
          <label
            htmlFor="logo"
            className="flex items-center justify-center w-full h-50 p-4 bg-white text-gray rounded cursor-pointer hover:bg-gray-100 transition"
          >
            Upload Logo
          </label>

          {/* Optional: show selected file name */}
          {logo && (
            <p className="mt-2 text-sm text-gray-700">Selected: {logo.name}</p>
          )}
        </label>

        {/* Submit */}
        <button
          className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
          type="submit"
        >
          Sign up
        </button>
        <button
          className="w-full py-2 bg-indigo-500 text-white font-semibold rounded hover:bg-indigo-700 transition"
          onClick={() => {
            router.push(`/login`);
          }}
        >
          Log in
        </button>
      </form>
    </div>
  );
}
