import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md dark:bg-gray-900">
      {/* Left Section: Logo + Title */}
      <div className="flex items-center gap-3">
        <Image
          src="/airdrop.webp"
          alt="tsenderUI logo"
          width={32}
          height={32}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white hover:text-indigo-600 transition duration-300">
          tsenderUI
        </h1>
      </div>

      {/* Middle Section: GitHub */}
      <Link
        href="https://github.com/elijahlaryea"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition duration-300"
      >
        <FaGithub size={24} />
        <span className="hidden sm:inline-block font-medium">GitHub</span>
      </Link>

      {/* Right Section: Connect Button */}
      <div className="ml-auto">
        <ConnectButton />
      </div>
    </header>
  );
};

export default Header;
