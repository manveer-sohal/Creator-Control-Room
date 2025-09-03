import Image from "next/image";
import Signout from "./signout";
interface prop {
  logourl: string | null;
  company_name: string | null;
}

function NavBar({ logourl, company_name }: prop) {
  console.log(logourl);
  return (
    <nav className="bg-[var(--widget)] dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          {logourl && (
            <Image
              src={logourl}
              className="h-8"
              alt="Flowbite Logo"
              width={32}
              height={32}
            ></Image>
          )}
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {company_name}
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Signout />
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        ></div>
      </div>
    </nav>
  );
}

export default NavBar;
