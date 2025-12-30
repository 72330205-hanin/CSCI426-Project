import React, { useEffect, useState } from "react";
import api from "../api/axios"; // ✅ CHANGED
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/styles/myenrollments.css";

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api
      .get(`/api/enrollments/${user.id}`) // ✅ CHANGED
      .then((res) => {
        setEnrollments(res.data || []);
      })
      .catch((err) => console.error("GET ENROLLMENTS ERROR:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const cancelEnrollment = async (enrollmentId) => {
    const confirmed = window.confirm(
      "Do you really want to cancel this course?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/enroll/${enrollmentId}`); // ✅ CHANGED

      setEnrollments((prev) =>
        prev.filter((e) => e.enrollment_id !== enrollmentId)
      );

      alert("Course canceled successfully");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to cancel enrollment");
    }
  };

  return (
    <div className="page-layout">
      <Navbar />

      <main className="page-content">
        <div className="container my-enrollments-page">
          <h2 className="page-title">My Enrollments</h2>

          {loading && <p>Loading...</p>}

          {!loading && enrollments.length === 0 && (
            <p className="empty-text">You have no enrolled courses yet.</p>
          )}

          <div className="enrollments-grid">
            {enrollments.map((course) => {
              const imgSrc = course.thumbnail_url
                ? `/uploads/${course.thumbnail_url}` // ✅ CHANGED
                : "/images/course-placeholder.jpg";

              return (
                <div
                  className="enrollment-card"
                  key={course.enrollment_id}
                >
                  <div className="course-image">
                    <img
                      src={imgSrc}
                      alt={course.title || "Course"}
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/course-placeholder.jpg";
                      }}
                    />
                  </div>

                  <span className="course-category">
                    {course.course_type}
                  </span>

                  <h3 className="course-title">{course.title}</h3>

                  <div className="course-meta">
                    ⭐ {course.rating || 0} •{" "}
                    {course.lessons_count || 0} Lessons •{" "}
                    {course.duration_minutes || 0} min
                  </div>

                  <span className="enroll-date">
                    Enrolled on{" "}
                    {course.enrolled_at
                      ? new Date(
                          course.enrolled_at
                        ).toLocaleDateString()
                      : ""}
                  </span>

                  <div className="card-footer">
                    <span className="course-price">Enrolled</span>

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        cancelEnrollment(course.enrollment_id)
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyEnrollments;