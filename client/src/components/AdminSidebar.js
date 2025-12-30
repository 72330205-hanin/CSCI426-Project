import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/styles/adminSidebar.css";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";

const AdminSidebar = () => {
  return (
    <aside className="ad-sidebar">
      <div className="ad-brand">LMS Admin</div>

      <nav className="ad-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <DashboardOutlinedIcon fontSize="small" />
          </span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/courses"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <MenuBookOutlinedIcon fontSize="small" />
          </span>
          Courses
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <PeopleOutlineIcon fontSize="small" />
          </span>
          Users
        </NavLink>

        <NavLink
          to="/admin/enrollments"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <SchoolOutlinedIcon fontSize="small" />
          </span>
          Enrollments
        </NavLink>

        <NavLink
          to="/admin/feedback"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <RateReviewOutlinedIcon fontSize="small" />
          </span>
          Feedback
        </NavLink>

        <NavLink
          to="/admin/contact"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <MailOutlineIcon fontSize="small" />
          </span>
          Contact
        </NavLink>

        <NavLink
          to="/admin/popular-courses"
          className={({ isActive }) => `ad-navItem ${isActive ? "active" : ""}`}
        >
          <span className="ad-navIcon">
            <LocalFireDepartmentOutlinedIcon fontSize="small" />
          </span>
          Popular Courses
        </NavLink>
      </nav>

      <div className="ad-viewSite">
        <NavLink to="/" className="ad-viewBtn">
          <span className="ad-navIcon">
            <HomeOutlinedIcon fontSize="small" />
          </span>
          View Website
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
