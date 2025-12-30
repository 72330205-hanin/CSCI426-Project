import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.jpg.png";

const MobileMenu = ({ user, onClose }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    onClose();
  };

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  const handleGetStarted = () => {
    navigate("/get-started");
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    onClose();
  };

  return (
    <div className="mobile-menu-overlay">
      <div className="mobile-menu">
        <div className="mobile-menu-header">
          <img
            src={logo}
            alt="LearnHub logo"
            className="mobile-menu-logo"
            onClick={handleLogoClick}
          />

          <button className="mobile-menu-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="mobile-menu-links">
          <Link to="/about" onClick={onClose}>About</Link>
          <Link to="/courses" onClick={onClose}>Courses</Link>
          <Link to="/features" onClick={onClose}>Features</Link>
          <Link to="/contact" onClick={onClose}>Contact</Link>

          {user && (
            <Link to="/my-enrollments" onClick={onClose}>
              My Enrollments
            </Link>
          )}
        </nav>

        <div className="mobile-menu-actions">
          {!user && (
            <>
              <button className="btn btn-ghost full-width" onClick={handleLogin}>
                Log in
              </button>
              <button className="btn btn-primary full-width" onClick={handleGetStarted}>
                Get Started
              </button>
            </>
          )}

          {user && (
            <button className="btn btn-ghost full-width" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;