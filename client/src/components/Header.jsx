import React, { useEffect, useState } from "react";
import { Search, Heart, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLogo from "../assets/user-logo.svg";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    // Sync input box with query from URL (if user refreshes on /explore?search=foo)
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search");
    if (searchTerm) setSearchInput(searchTerm);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/explore"); // fetch all if input empty
    }
  };

  return (
    <header className="bg-[#f4f4f4] border-b-4 border-black text-black font-sans">
      {/* Top Bar */}
      <div className="max-w-[1480px] mx-auto px-6 py-4 sm:px-10 sm:py-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight uppercase">
            <span className="text-black">MAKAUT</span>
            <span className="text-gray-600">enant</span>
          </h1>
        </Link>

        {/* Search - Only on desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex items-center bg-white border-2 border-black px-3 py-1 rounded-sm shadow-[3px_3px_0px_0px_black] w-[440px]"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-lg w-full py-1.5"
          />
          <button type="submit">
            <Search className="ml-2 size-6 text-black" />
          </button>
        </form>

        {/* Right Section */}
        <ul className="flex items-center gap-3 sm:gap-4 font-semibold text-md sm:text-lg">
          {/* Authenticated - Desktop Only Links */}
          {currentUser && (
            <>
              <Link to="/manage-properties" className="hidden sm:inline">
                <li className="hover:underline cursor-pointer">Manage</li>
              </Link>
              <Link to="/wishlist" className="hidden sm:inline">
                <li className="hover:underline cursor-pointer">Wishlist</li>
              </Link>
            </>
          )}
          <Link to="/about" className="hidden sm:inline">
            <li className="hover:underline cursor-pointer">About</li>
          </Link>

          {/* Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Icons */}
              <div className="flex sm:hidden items-center gap-2 mr-1">
                <Link to="/wishlist">
                  <Heart className="w-5 h-5 text-black" />
                </Link>
                <Link to="/manage-properties">
                  <Home className="w-5 h-5 text-black" />
                </Link>
              </div>

              {/* Avatar */}
              <div className="p-[2px] rounded-full border-4 border-black bg-white">
                <Link to="/profile">
                  <img
                    src={currentUser?.avatar || currentUser?.data?.avatar || UserLogo}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/sign-in">
                <li className="px-3 py-1 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#f5e9b3] transition">
                  Sign In
                </li>
              </Link>
              <Link to="/sign-up" className="hidden sm:inline">
                <li className="px-3 py-1 bg-black text-white border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#f5e9b3] hover:text-black transition">
                  Sign Up
                </li>
              </Link>
            </div>
          )}
        </ul>
      </div>

      {/* Search - Mobile */}
      <div className="sm:hidden px-6 pb-4">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white border-2 border-black px-3 py-1 rounded-sm shadow-[3px_3px_0px_0px_black] w-full"
        >
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-base w-full py-1"
          />
          <button type="submit">
            <Search className="ml-2 size-6 text-black" />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
