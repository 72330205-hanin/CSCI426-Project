import React, { useEffect, useState } from "react";
import "../assets/styles/about.css";

const AboutCenter = () => {
  const [subjects, setSubjects] = useState(1);
  const [courses, setCourses] = useState(1);
  const [instructors, setInstructors] = useState(1);
  const [students, setStudents] = useState(1);

  useEffect(() => {
    const timers = [];

    timers.push(setInterval(() => setSubjects(prev => (prev < 123 ? prev + 1 : 123)), 10));
    timers.push(setInterval(() => setCourses(prev => (prev < 500 ? prev + 1 : 500)), 8));
    timers.push(setInterval(() => setInstructors(prev => (prev < 130 ? prev + 1 : 130)), 12));
    timers.push(setInterval(() => setStudents(prev => (prev < 1234 ? prev + 1 : 1234)), 5));

    return () => timers.forEach(clearInterval);
  }, []);

  return (
  
    <section id="about-center" className="about-center">
      <h1 className="about-title big">
        First Choice For Offline Education 
      </h1>
      <p className="about-text">
       We believe education is not just about learning it, is about transforming potential into achievement. Our platform empowers every learner to explore, grow, and excel through smart, accessible, and engaging technology.
      </p>

      <div className="about-stats centered">
        <div className="stat blue1">
          <h2>{subjects}</h2>
          <p>AVAILABLE SUBJECTS</p>
        </div>

        <div className="stat blue2">
          <h2>{courses}</h2>
          <p>EXPERT COURSES</p>
        </div>

        <div className="stat blue3">
          <h2>{instructors}</h2>
          <p>QUALIFIED INSTRUCTORS</p>
        </div>

        <div className="stat blue4">
          <h2>{students}</h2>
          <p>ACTIVE STUDENTS</p>
        </div>
      </div>
    </section>
   
  );
};

export default AboutCenter;