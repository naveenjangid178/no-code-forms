import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for the collapsible menu
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking login status. Replace with your authentication logic.
    const adminToken = localStorage.getItem("adminToken");
    setIsAdminLoggedIn(!!adminToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove admin token
    setIsAdminLoggedIn(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-lg font-bold">
          <Link to="/">No-Code Forms</Link>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Menu Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-4`}
        >
          {/* Common Links */}
          <Link
            to="/"
            className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block lg:inline-block"
          >
            Home
          </Link>

          {/* Links for Admin */}
          {isAdminLoggedIn ? (
            <>
              <Link
                to="/all-forms"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block lg:inline-block"
              >
                All Forms
              </Link>
              <Link
                to="/create-form"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block lg:inline-block"
              >
                Create Form
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md block lg:inline-block"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block lg:inline-block"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md block lg:inline-block"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;