import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { headItems } from "./navitems";
import logo from "./logo.webp";
import "../App.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const updateAuthState = () => {
      const isGuest = JSON.parse(localStorage.getItem("guestUser"));
      if (isGuest) {
        setUser(isGuest);
        setLoading(false);
        return;
      }
      const token = localStorage.getItem("token");
      if (token) {
        fetchUser(token);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    window.addEventListener("authChange", updateAuthState);
    updateAuthState();

    return () => {
      window.removeEventListener("authChange", updateAuthState);
    };
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/verifyuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response?.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("guestUser");
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  const scrollToSection = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("guestUser");
    setUser(null);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    toast.success("Logout Successful!", { autoClose: 2000 });

    setTimeout(() => {
      navigate("/login");
    }, 500);
  }, [navigate]);

  const hideNavbarItemsPaths = [
    "/book",
    "/viewroom",
    "/homescreen",
    "/login",
    "/register",
    "/profile",
    "/admin",
  ];
  const hideNavbarItems = hideNavbarItemsPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const toggleDropdown = useCallback((e) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  }, []);

  return (
    <nav>
      <div className="navbar-container">
        <div className="logo">
          <img src={logo} alt="Logo" />
          <span>StaySphere</span>
        </div>

        <div
          className={`hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className={`navbarinfo ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
          {!hideNavbarItems && (
            <ul className="header">
              {headItems.map((item) => (
                <li key={item.id} className="navitems">
                  {item.url.startsWith("/") ? (
                    <Link to={item.url} onClick={() => setIsMenuOpen(false)}>
                      {item.title}
                    </Link>
                  ) : (
                    <Link to={`#${item.url}`} onClick={() => scrollToSection(item.url)}>
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}

          {loading ? null : user ? (
            <div className={`dropdown ${isDropdownOpen ? "show" : ""}`} ref={dropdownRef}>
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
                  setIsMenuOpen(false);
                }}>
                  <i className="fa-solid fa-house"></i> Home
                </Link>
                <Link className="dropdown-item text-dark" to="/profile" onClick={() => {
                  setIsDropdownOpen(false);
                  setIsMenuOpen(false);
                }}>
                  <i className="fa-solid fa-user"></i> Profile
                </Link>
                {user.isAdmin && (
                  <Link className="dropdown-item text-dark" to="/admin" onClick={() => {
                    setIsDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}>
                    <i className="fa-solid fa-user-tie"></i> Admin
                  </Link>
                )}
                <Link className="dropdown-item text-dark" onClick={logout}>
                  <i className="fa-solid fa-right-from-bracket"></i> Logout
                </Link>
              </div>
            </div>
          ) : (
            <div className="userdetails">
              <li><Link to="/register" onClick={() => setIsMenuOpen(false)}>Register</Link></li>
              <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link></li>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
