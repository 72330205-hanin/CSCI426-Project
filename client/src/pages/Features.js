import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ScheduleIcon from "@mui/icons-material/Schedule";

const featuresList = [
  {
    title: "Comprehensive Course Library",
    description:
      "Access thousands of courses across multiple disciplines, from beginner to advanced levels.",
    icon: <MenuBookIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Interactive Video Lessons",
    description:
      "Engage with high-quality video content, quizzes, and hands-on projects for better retention.",
    icon: <PlayCircleFilledIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Expert Instructors",
    description:
      "Learn from industry professionals and educators with real-world experience.",
    icon: <SchoolIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with detailed analytics and personalized insights.",
    icon: <AssessmentIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Certifications",
    description:
      "Earn recognized certificates upon course completion to showcase your achievements.",
    icon: <WorkspacePremiumIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Learn at Your Pace",
    description:
      "Flexible scheduling with lifetime access to course materials on any device.",
    icon: <ScheduleIcon style={{ fontSize: 40 }} />,
  },
];

const Features = () => {
  return (
    <>   
    <Navbar />
      <div className="features-container">
     
        <h1 className="features-title">Everything You Need to Succeed</h1>
        <p className="features-subtitle">
          Our platform provides all the tools and resources you need for an
          exceptional learning experience.
        </p>

        <div className="features-grid">
          {featuresList.map((item, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{item.icon}</div>
              <h3 className="feature-title">{item.title}</h3>
              <p className="feature-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Features;
