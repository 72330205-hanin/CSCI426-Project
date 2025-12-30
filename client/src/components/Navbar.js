import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import logo from "../assets/images/logo.jpg.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="navbar-left" onClick={handleLogoClick}>
            <img src={logo} alt="LearnHub logo" className="navbar-logo" />
          </div>

          <nav className="navbar-links">
            <Link to="/about">About</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact</Link>

            {user && user.role === "user" && (
              <Link to="/my-enrollments">My Enrollments</Link>
            )}

            {user && user.role === "admin" && (
              <Link to="/admin/dashboard">Admin Panel</Link>
            )}
          </nav>

          <div className="navbar-actions">
            {!user ? (
              <>
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/get-started")}
                >
                  Get Started
                </button>
              </>
            ) : (
              <button className="btn btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>

          <button
            className="navbar-burger"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <MobileMenu
          user={user}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;