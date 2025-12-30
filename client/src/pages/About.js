import React, { useState } from "react";
import "../assets/styles/about.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutCenter from "../components/AboutCenter";
import aboutImage from "../assets/images/about-hero.jpg";

const About = () => {
  const [showAboutCenter, setShowAboutCenter] = useState(false);

  const handleReadMore = () => {
    setShowAboutCenter(true);

    setTimeout(() => {
      const target = document.getElementById("about-center");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      <Navbar />

      <section className="about-hero">
        <div className="about-hero-inner">

          <div className="about-image-wrapper">
            <img src={aboutImage} alt="LearnHub student" className="about-image" />
          </div>

          <div className="about-content">
            <div className="about-label-wrapper">
            <span className="about-label-line"></span>
            <span className="about-label-text">ABOUT US</span>
            <span className="about-label-line"></span>
          </div>

            <h1 className="about-heading">Welcome to LearnHub</h1>

            <p className="about-paragraph">
              Your journey toward knowledge, growth, and success truly begins here. Dive into courses tailored for your goals, track your achievements, and learn comfortably at your own pace.
            </p>

            <p className="about-paragraph">
             Every step you take brings you closer to becoming the best version of yourself. We’re excited to support you, inspire you, and grow with you. Let’s unlock your potential together!
            </p>

            <div className="about-features-grid">

              <div className="about-feature-column">
                <div className="about-feature-item">
                  <span className="about-feature-icon">➤</span>
                  Skilled Instructors
                </div>
                <div className="about-feature-item">
                  <span className="about-feature-icon">➤</span>
                  International Certificate
                </div>
                <div className="about-feature-item">
                  <span className="about-feature-icon">➤</span>
                  Offline Classes
                </div>
              </div>

            
              <div className="about-feature-column">
                <div className="about-feature-item">
                  <span className="about-feature-icon">➤</span>
                  Expert courses
                </div>
                <div className="about-feature-item">
                  <span className="about-feature-icon">➤</span>
                  Qualified Instructors
                </div>
                <div className="about-feature-item">
                  <span className="about-feature-icon">➤</span>
                  Active students
                </div>
              </div>

            </div>

            <button className="btn about-readmore-btn" onClick={handleReadMore}>
              Read More
            </button>
          </div>
        </div>
      </section>

      {showAboutCenter && (
        <div id="about-center-wrapper">
          <AboutCenter />
        </div>
      )}

      <Footer />
    </>
  );
};

export default About;
