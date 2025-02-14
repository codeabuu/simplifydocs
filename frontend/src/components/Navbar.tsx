import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import {
  FileSpreadsheet,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Function to handle link clicks with page refresh
  const handleLinkClick = (path: string) => {
    window.location.href = path; // This will force a page refresh and redirect
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-8 h-8 text-primary-500" />
            <Link to="/" className="text-xl font-bold gradient-text">Lovable.ai</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("/");
              }}
              className={`text-gray-600 hover:text-primary-500 transition-colors ${
                isActive("/") ? "text-primary-500 font-semibold" : ""
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
              className={`text-gray-600 hover:text-primary-500 transition-colors ${
                isActive("/#features") ? "text-primary-500 font-semibold" : ""
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
              className={`text-gray-600 hover:text-primary-500 transition-colors ${
                isActive("/pricing") ? "text-primary-500 font-semibold" : ""
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
              className={`text-gray-600 hover:text-primary-500 transition-colors ${
                isActive("/#about") ? "text-primary-500 font-semibold" : ""
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
              className={`text-gray-600 hover:text-primary-500 transition-colors ${
                isActive("/#contact") ? "text-primary-500 font-semibold" : ""
              }`}
            >
              Contact
            </a>
            <Link
              to="/login"
              className={`px-4 py-2 text-gray-600 hover:text-primary-500 transition-colors ${
                isActive("/login") ? "text-primary-500 font-semibold" : ""
              }`}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 p-4">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick("/");
                }}
                className={`text-gray-600 hover:text-primary-500 transition-colors ${
                  isActive("/") ? "text-primary-500 font-semibold" : ""
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
                className={`text-gray-600 hover:text-primary-500 transition-colors ${
                  isActive("/#features") ? "text-primary-500 font-semibold" : ""
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
                className={`text-gray-600 hover:text-primary-500 transition-colors ${
                  isActive("/pricing") ? "text-primary-500 font-semibold" : ""
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
                className={`text-gray-600 hover:text-primary-500 transition-colors ${
                  isActive("/#about") ? "text-primary-500 font-semibold" : ""
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
                className={`text-gray-600 hover:text-primary-500 transition-colors ${
                  isActive("/#contact") ? "text-primary-500 font-semibold" : ""
                }`}
              >
                Contact
              </a>
              <Link
                to="/login"
                className={`px-4 py-2 text-gray-600 hover:text-primary-500 transition-colors ${
                  isActive("/login") ? "text-primary-500 font-semibold" : ""
                }`}
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 gradient-bg text-white rounded-lg hover:opacity-90 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;