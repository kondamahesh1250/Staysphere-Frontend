import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import { headItems } from "./navitems";
import logo from "./logo.webp";
import "../App.css"


const Navbar = () => {
  const token = localStorage.getItem("token")
  const [user, setUser] = useState(null); // For user data
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false); // For hamburger menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For dropdown menu visibility

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const isGuest = (localStorage.getItem("guestUser"));
    if (isGuest) {
      setUser(isGuest);
      return;
    }
  
    if (token) {
      fetchUser(token);
    }
  }, [token,navigate]);
  

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/verifyuser`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response?.data);

    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("guestUser");
    }
  };

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
    localStorage.removeItem("token");
    localStorage.removeItem("guestUser");
    setUser(null);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    toast.success("Logout Successful!", { autoClose: 2000 });
  
    setTimeout(() => {
      navigate("/login");
    }, 500);  // Small delay to allow state updates
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
                <Link className="dropdown-item text-dark" to="/" onClick={() => {
                  setIsDropdownOpen(false);
                  setIsMenuOpen(false);  // Close hamburger menu as well
                }}><i class="fa-solid fa-house"></i>
                  Home
                </Link>
                <Link className="dropdown-item text-dark" to="/profile" onClick={() => {
                  setIsDropdownOpen(false);
                  setIsMenuOpen(false);  // Close hamburger menu as well
                }}><i class="fa-solid fa-user"></i>
                  Profile
                </Link>
                {user.isAdmin && (
                  <Link className="dropdown-item text-dark" to="/admin" onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMenuOpen(false);  // Close hamburger menu as well
                  }}><i class="fa-solid fa-user-tie"></i>
                    Admin
                  </Link>
                )}
                <Link className="dropdown-item text-dark" onClick={()=>logout()}><i class="fa-solid fa-right-from-bracket"></i>
                  Logout
                </Link>
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
