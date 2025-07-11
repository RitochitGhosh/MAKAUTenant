import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-[#f4f4f4] border-b-4 border-black text-black font-sans">
      <div className="max-w-[1480px] mx-auto px-6 py-4 sm:px-10 sm:py-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight uppercase">
            <span className="text-black">MAKAUT</span>
            <span className="text-gray-600">enant</span>
          </h1>
        </Link>

        {/* Search */}
        <form className="hidden sm:flex items-center bg-white border-2 border-black px-3 py-1 rounded-sm shadow-[3px_3px_0px_0px_black] w-[440px]">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-lg w-[400px] py-1.5"
          />
          <Search className="ml-2 size-6 text-black" />
        </form>

        {/* Navigation */}
        <ul className="flex items-center gap-3 sm:gap-4 font-semibold text-md sm:text-lg">
          {/* Show on sm and above */}
          <Link to="/" className="hidden sm:inline">
            <li className="hover:underline cursor-pointer">Profile</li>
          </Link>
          <Link to="/about" className="hidden sm:inline">
            <li className="hover:underline cursor-pointer">About</li>
          </Link>

          {/* Sign In - always visible */}
          <Link to="/sign-in">
            <li className="px-3 py-1 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#f5e9b3]  transition">
              Sign In
            </li>
          </Link>

          {/* Sign Up - only on sm and above */}
          <Link to="/sign-up" className="hidden sm:inline">
            <li className="px-3 py-1 bg-black text-white border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#f5e9b3] hover:text-black transition">
              Sign Up
            </li>
          </Link>
        </ul>
      </div>
      <div className="flex sm:hidden px-6 pb-4">
        <form className="flex items-center bg-white border-2 border-black px-3 py-1 rounded-sm shadow-[3px_3px_0px_0px_black] w-full">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-lg w-[400px] py-1"
          />
          <Search className="ml-2 size-6 text-black" />
        </form>
      </div>
    </header>
  );
};

export default Header;
