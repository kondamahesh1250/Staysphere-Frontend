import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { headItems } from "./navitems";
import "../App.css"
import logo from "./logo.webp";
import axios from "axios";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For hamburger menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown menu visibility
  const [user, setUser] = useState(null); // For user data

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {

    const isGuest = JSON.parse(localStorage.getItem("guestUser")); // Check guest mode
    if (isGuest) {
     return setUser(isGuest);
    }

    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Get token from storage
      if (!token) {
        return;
      }; // If no token, user is not logged in

      try {
        const response = await axios.get('/api/users/verifyuser', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response?.data); // Set user data from API response
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    };

    fetchUser();
  }, [localStorage.getItem("token"), localStorage.getItem("guestUser")]); // Run on token change


  // Close both dropdown and hamburger when clicking outside
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false); // Close hamburger menu if clicked outside
    }

    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Close dropdown if clicked outside
    }
  };

  // Add event listeners for closing dropdown and hamburger menu on outside click
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Close menu after clicking
  };

  const logout = () => {
    // localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    localStorage.removeItem("guestUser");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  // Define paths where navbar items should be hidden
  const hideNavbarItemsPaths = [
    "/book",
    "/viewroom",
    "/homescreen",
    "/login",
    "/register",
    "/profile",
    "/admin",];

  // Check if the current page matches one of the paths
  const hideNavbarItems = hideNavbarItemsPaths.some(path => location.pathname.startsWith(path));


  // Toggle dropdown menu visibility
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up and closing the menu
    setIsDropdownOpen((prev) => !prev);
  };

  console.log(user)

  return (
    <nav>
      <div className="navbar-container">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span>StaySphere</span>
        </div>

        {/* Hamburger Icon */}
        <div
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click from propagating to handleClickOutside
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Navbar Items */}
        <div className={`navbarinfo ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
          {!hideNavbarItems && (
            <ul className="header">
              {headItems.map((item) => (
                <li key={item.id} className="navitems">
                  {item.url.startsWith("/") ? (
                    <Link
                      to={item.url}
                      onClick={() => setIsMenuOpen(false)} // Close menu
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <Link
                      to={`#${item.url}`}
                      onClick={() => scrollToSection(item.url)}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}



          {/* User Dropdown or Login/Register */}
          {user ? (
            <div
              className={`dropdown ${isDropdownOpen ? "show" : ""}`}
              ref={dropdownRef}
            >
              <button
                className="btn btn-secondary dropdown-toggle bg-black"
                type="button"
                aria-expanded={isDropdownOpen ? "true" : "false"}
                onClick={toggleDropdown}
              >
                <i className="fa-regular fa-user mr-2"></i>
                {user.name}
              </button>

              <div className="dropdown-menu bg-white" style={{ textAlign: "center" }}>
                <a className="dropdown-item text-dark" href="/"><i class="fa-solid fa-house"></i>
                  Home
                </a>
                <a className="dropdown-item text-dark" href="/profile"><i class="fa-solid fa-user"></i>
                  Profile
                </a>
                {user.isAdmin && (
                  <a className="dropdown-item text-dark" href="/admin"><i class="fa-solid fa-user-tie"></i>
                    Admin
                  </a>
                )}
                <a className="dropdown-item text-dark" href="#" onClick={logout}><i class="fa-solid fa-right-from-bracket"></i>
                  Logout
                </a>
              </div>
            </div>
          ) : (
            <div className="userdetails">
              <li>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
