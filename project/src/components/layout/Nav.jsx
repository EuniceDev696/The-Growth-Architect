// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ACTIVE_LOGO } from "../../branding/logoSet";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Highlight active link
  const linkClass = (path) =>
    `hover:text-teal-500 transition-colors duration-300 ${
      location.pathname === path ? "text-teal-600 font-bold" : "text-indigo-700"
    }`;

  const publicLinks = (
    <>
      <li>
        <Link to="/home" className={linkClass("/home")} onClick={() => setOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/about" className={linkClass("/about")} onClick={() => setOpen(false)}>
          About
        </Link>
      </li>
      <li>
        <Link to="/services" className={linkClass("/services")} onClick={() => setOpen(false)}>
          Services
        </Link>
      </li>
      <li>
        <Link to="/contact" className={linkClass("/contact")} onClick={() => setOpen(false)}>
          Contact
        </Link>
      </li>
      <li>
        <Link to="/casestudies" className={linkClass("/casestudies")} onClick={() => setOpen(false)}>
          Case Studies
        </Link>
      </li>
      <li className="pt-1 md:pt-0">
        <Link to="/booking" onClick={() => setOpen(false)}>
          <button
            className="
              w-full md:w-auto
              bg-teal-600 text-white font-semibold
              px-6 py-3 md:py-2.5
              rounded-xl
              hover:bg-teal-700 active:bg-teal-800
              transition-all duration-200
              shadow-sm
            "
          >
            Book Consultation
          </button>
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-16 md:h-20">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0">
            <img
              src={ACTIVE_LOGO}
              alt="The Growth Architect Logo"
              className="h-10 sm:h-11 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-[15px] font-medium tracking-wide">
            {publicLinks}
          </ul>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-800 focus:outline-none p-2"
              aria-label="Toggle navigation menu"
            >
              {open ? (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <ul className="px-5 py-6 flex flex-col gap-5 text-base font-medium text-indigo-700">
            {publicLinks}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
