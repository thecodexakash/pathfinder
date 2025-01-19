"use client";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <Link
        href="/"
        className="text-3xl font-bold text-white hover:text-blue-400 transition-colors duration-300"
      >
        Pathfinder
      </Link>
      <span className="text-lg font-medium text-gray-400">Guest Mode</span>
    </header>
  );
};

export default Header;
