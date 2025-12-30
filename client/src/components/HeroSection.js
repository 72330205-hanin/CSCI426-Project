import React from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/images/hero-classroom.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate("/get-started");
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-left">
          <div className="badge-pill">
          <span className="badge-dot"></span>
           New: AI-Powered Course Recommendations
          </div>

          <h1 className="hero-title">Transform Your Learning Journey</h1>

          <p className="hero-text">
            Access world-class courses, track your progress, and achieve your
            goals with our comprehensive learning management platform designed
            for modern learners.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={handleStartLearning}>
              Start Learning Free
            </button>
          </div>

          <div className="hero-metrics">
            <div>
              <span className="metric-number">50K+</span>
              <span className="metric-label">Active Learners</span>
            </div>
            <div>
              <span className="metric-number">1,200+</span>
              <span className="metric-label">Courses</span>
            </div>
            <div>
              <span className="metric-number">4.9/5</span>
              <span className="metric-label">Avg Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-wrapper">
            <img src={heroImg} alt="Students learning in a classroom" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;