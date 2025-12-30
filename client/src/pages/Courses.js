
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AllCourses from "../components/AllCourses";
import Footer from "../components/Footer";
import "../assets/styles/courses.css"; 

const Courses = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main>
       <section className="pagee-header">
  <div className="container courses-header">
    <div>
      <h1>Browse Courses</h1>
      <p>
        Discover courses across development, data science, design,
        business and more.
      </p>
    </div>

    <button className="outline-btn" onClick={() => navigate("/feedback")}>
  Give Feedback
</button>

  </div>
</section>

        <AllCourses />
      </main>

      <Footer />
    </>
  );
};

export default Courses;

