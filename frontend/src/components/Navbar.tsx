import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileSpreadsheet, Menu, X, ChevronRight } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    // Special case for home - only active when exactly on "/"
    if (path === "/") {
      return location.pathname === "/" && !location.hash;
    }
    
    return location.pathname === path || 
           (path === '/#features' && location.hash === '#features') ||
           (path === '/#about' && location.hash === '#about') ||
           (path === '/#contact' && location.hash === '#contact');
  };

  const handleLinkClick = (path: string) => {
    window.location.href = path;
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-white/50 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/homelogo-preview.png"
                alt="AskAnalytIQ Logo"
                className="h-12 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/");
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } group`}
              >
                Home
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>

              <a
                href="/#features"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/#features");
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/#features")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } group`}
              >
                Features
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive("/#features") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>

              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/pricing");
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/pricing")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } group`}
              >
                Pricing
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive("/pricing") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>

              <a
                href="/#about"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/#about");
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/#about")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } group`}
              >
                About
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive("/#about") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>

              <a
                href="/#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/#contact");
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive("/#contact")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                } group`}
              >
                Contact
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    isActive("/#contact") ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </a>
            </div>

            <div className="flex items-center space-x-4 ml-8">
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  isActive("/login")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className={`px-5 py-2.5 text-sm font-semibold rounded-md shadow-md transition-all duration-300 transform hover:scale-[1.03] ${
                  isActive("/signup")
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                }`}
              >
                Sign Up Free
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-xl rounded-b-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/");
              }}
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Home
            </a>
            <a
              href="/#features"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/#features");
              }}
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive("/#features")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Features
            </a>
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/pricing");
              }}
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive("/pricing")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Pricing
            </a>
            <a
              href="/#about"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/#about");
              }}
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive("/#about")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              About
            </a>
            <a
              href="/#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/#contact");
              }}
              className={`block px-3 py-3 rounded-md text-base font-medium ${
                isActive("/#contact")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              }`}
            >
              Contact
            </a>
            <div className="pt-2 pb-3 border-t border-gray-200">
              <div className="mt-3 space-y-1">
                <Link
                  to="/login"
                  className={`block w-full px-4 py-2 text-left text-base font-medium rounded-md ${
                    isActive("/login")
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className={`block w-full px-4 py-2 text-left text-base font-medium rounded-md ${
                    isActive("/signup")
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;