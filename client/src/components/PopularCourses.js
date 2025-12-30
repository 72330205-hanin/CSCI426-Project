import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const PopularCourses = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewCourses = () => {
    navigate("/courses");
  };

  useEffect(() => {
    const loadPopular = async () => {
      try {
        const res = await axios.get(`${API}/api/popular-courses`);
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load popular courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopular();
  }, []);

  return (
    <section className="popular-courses-section">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>Popular Courses</h2>
            <p>Explore our most popular courses taught by industry experts.</p>
          </div>

          <button className="btn btn-outline-small" onClick={handleViewCourses}>
            View All Courses
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && courses.length === 0 && (
          <p style={{ marginTop: 12 }}>No popular courses yet.</p>
        )}

        <div className="course-grid">
          {courses.map((c) => (
            <div className="course-card" key={c.id}>
              <CourseCard
                image={
                  c.thumbnail_url
                    ? `${API}/uploads/${c.thumbnail_url}`
                    : "/images/course-placeholder.jpg"
                }
                category={c.category || "General"}
                title={c.title || "Course"}
                instructor={`by ${c.instructor || "Unknown"}`}
                rating={String(c.rating ?? "0")}
                students={`${c.lessons_count || 0} lessons`}
                duration={`${c.duration_minutes || 0} min`}
                level={c.section || "Beginner"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;