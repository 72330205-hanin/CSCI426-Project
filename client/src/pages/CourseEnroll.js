import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/styles/enroll.css";
import EnrollmentSuccessModal from "../components/EnrollmentSuccessModal";

const CourseEnroll = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state;

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="enroll-wrapper">
          <h2 style={{ color: "red", textAlign: "center", marginTop: "30px" }}>
            Error: No course data received.
          </h2>
          <button
            onClick={() => navigate("/courses")}
            className="enroll-btn"
            style={{ marginTop: "20px" }}
          >
            Go Back to Courses
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="enroll-wrapper">
        <div className="enroll-left">
          <h1>{course.title}</h1>

          <p className="enroll-sub">
            Become skilled with this full training course.
          </p>

          <div className="enroll-instructor">
            <strong>Created by:</strong> {course.instructor}
          </div>

          <ul className="enroll-list">
            <p>✔ Full course access</p>
            <p>✔ Certificate included</p>
            <p>✔ Access on all devices</p>
            <p>✔ Lifetime access</p>
          </ul>
        </div>

        <div className="enroll-right">
          <div className="price-box">
            <h2 className="free-price">
              {course.price ? course.price : "Free"}
            </h2>

            <button
              className="enroll-btn"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Enroll Now
            </button>

            <ul className="feature-list">
              <p>42.5 hours on-demand</p>
              <p>12 articles</p>
              <p>45 downloads</p>
              <p>Certificate of completion</p>
            </ul>
          </div>
        </div>
      </div>

      <EnrollmentSuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </>
  );
};

export default CourseEnroll;