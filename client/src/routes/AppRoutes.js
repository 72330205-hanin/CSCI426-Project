import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminContact from "../pages/AdminContact";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Features from "../pages/Features";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import GetStarted from "../pages/GetStarted";
import CourseEnroll from "../pages/CourseEnroll";
import CourseCheckout from "../pages/CourseCheckout";
import About from "../pages/About";
import Feedback from "../pages/Feedback";
import MyEnrollments from "../pages/MyEnrollments";
import AdminDashboard from "../pages/AdminDashboard";
import AdminCourses from "../pages/AdminCourses";
import ScrollToTop from "../components/ScrollToTop";
import AdminUsers from "../pages/AdminUsers";
import AdminEnrollments from "../pages/AdminEnrollments";
import AdminFeedback from "../pages/AdminFeedback";
import AdminPopularCourses from "../pages/AdminPopularCourses";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <HashRouter>
      <ScrollToTop />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/feedback" element={<Feedback />} />

        <Route path="/enroll" element={<CourseEnroll />} />
        <Route path="/checkout" element={<CourseCheckout />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />


        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
       <Route path="/admin/courses" element={<AdminCourses />} />
       <Route path="/admin/users" element={<AdminUsers />} />
       <Route path="/admin/contact" element={<AdminContact />} />
       <Route path="/admin/enrollments" element={<AdminEnrollments />} />
       <Route path="/admin/feedback" element={<AdminFeedback />} />
       <Route path="/admin/popular-courses" element={<AdminPopularCourses />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;