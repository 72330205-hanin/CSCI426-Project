import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import PopularCourses from "../components/PopularCourses";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/get-started");
  };

  const handleContactSales = () => {
    navigate("/Contact");
  };

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PopularCourses />
        <StatsSection />
        <section className="cta-section">
          <div className="container cta-inner">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>
              Join thousands of learners already transforming their careers.
              Get started today with a 7-day free trial.
            </p>
            <div className="cta-actions">
              <button className="btn btn-primary" onClick={handleGetStarted}>
                Get Started Free
              </button>

              <button className="btn btn-ghost" onClick={handleContactSales}>
                Contact
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
