import React from "react";
import { Link } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import logofooter from "../assets/images/logofooter.jpg.png";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logofooter} alt="LearnHub" />
          </div>
          <p>
            Empowering learners worldwide with quality education and innovative
            learning experiences.
          </p>
          <div className="footer-social">
             <InstagramIcon /> <TwitterIcon /> <FacebookIcon /> <LinkedInIcon />
          </div>
        </div>

        <div className="footer-column">
          <h4>Platform</h4>
          <Link to="/courses">Browse Courses</Link>
          <a href="#!">For Instructors</a>
          <a href="#!">For Business</a>
          <a href="#!">Mobile App</a>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <a href="#!">Help Center</a>
          <a href="#!">Blog</a>
          <a href="#!">Community</a>
          <a href="#!">Career Paths</a>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <Link to="/Contact">Contact Us</Link>
          <a href="#!">Careers</a>
          <a href="#!">Privacy Policy</a>
          <a href="#!">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2025 LearnHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;