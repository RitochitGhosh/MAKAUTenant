import { useEffect, useState } from "react";
import developerImg from "../assets/developer.jpg";

const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="bg-black text-white w-full mt-20 border-t-4 border-white">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* MAKAUTenant Overview */}
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold uppercase tracking-wide">
            MAKAUTenant
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Your one-stop rental platform built for MAKAUT students and residents.
            Discover, list, or rent student-friendly accommodations with ease and safety.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <a href="/about" className="underline underline-offset-2">
                About
              </a>
            </li>
            <li>
              <a href="/explore" className="underline underline-offset-2">
                Explore Listings
              </a>
            </li>
            <li>
              <a href="/add-property" className="underline underline-offset-2">
                Add Property
              </a>
            </li>
            <li>
              <a href="/contact" className="underline underline-offset-2">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Contact</h3>
          <p>
            Phone:{" "}
            <a
              href="tel:+917439400371"
              className="underline underline-offset-2"
            >
              +91 7439400371
            </a>
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:imrito18@gmail.com"
              className="underline underline-offset-2"
            >
              imrito18@gmail.com
            </a>
          </p>
        </div>

        {/* Current Time */}
        <div className="text-sm md:text-right space-y-2">
          <h3 className="font-semibold">Current Time</h3>
          <p className="text-yellow-300 font-mono text-lg">{time}</p>
        </div>
      </div>

      {/* Bottom Developer Info */}
      <div className="border-t border-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img
              src={developerImg}
              alt="Ritochit Ghosh"
              className="w-10 h-10 rounded-full border-2 border-white shadow-[2px_2px_0px_#fff]"
            />
            <div>
              <p className="text-xs">Developed by</p>
              <a
                href="https://ritochit-ghosh-hna6.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold underline underline-offset-2"
              >
                Ritochit Ghosh
              </a>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} MAKAUTenant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
