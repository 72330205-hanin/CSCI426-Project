import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/allcourses.css";
import TrialPlansModal from "../components/TrialPlansModal";
import SubscriptionModal from "../components/SubscriptionModal";
import placeholder from "../assets/images/web.jpg";

const API = "http://localhost:5000";

const SECTION_META = {
  free: { title: "Free Courses", color: "#00d26a", button: "Enroll Now" },
  trial: { title: "Start with a Free Trial", color: "#3b82f6", button: "Start Trial", tag: "7-Day Free Trial" },
  paid: { title: "Best Value", color: "#a855f7", button: "Buy Now" },
  advanced: { title: "Advanced Masterclasses", color: "#f97316", button: "Buy Now" },
};

const AllCourses = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/courses`)
      .then((res) => buildSections(res.data))
      .catch((err) => console.error("COURSES FETCH ERROR:", err));
  }, []);

  const buildSections = (courses) => {
    const grouped = { free: [], trial: [], paid: [], advanced: [] };

    courses.forEach((c) => {
      if (!SECTION_META[c.section]) return;

      const img =
        c.thumbnail
          ? `${API}/uploads/${c.thumbnail}?v=${c.id}-${c.updated_at || c.created_at || Date.now()}`
          : placeholder;

      grouped[c.section].push({
        ...c,
        image: img,
        price:
          c.section === "free"
            ? "Free"
            : `$${Math.max(49, Math.round((Number(c.rating) || 4.5) * 20))}`,
        lessons: c.lessons_count,
        duration: `${Math.floor((Number(c.duration_minutes) || 0) / 60)}h ${(Number(c.duration_minutes) || 0) % 60}m`,
        button: SECTION_META[c.section].button,
        tag: SECTION_META[c.section].tag,
      });
    });

    const finalSections = Object.keys(grouped)
      .filter((key) => grouped[key].length > 0)
      .map((key) => ({ ...SECTION_META[key], courses: grouped[key] }));

    setSections(finalSections);
  };

  const getCourseType = (course) => {
    if (course.section === "free") return "Free Course";
    if (course.section === "trial") return "Free Trial";
    if (course.section === "advanced") return "Advanced Masterclass";
    return "Paid Course";
  };

  const enrollCourse = async (course) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login before enrolling");
      return false;
    }

    try {
      await axios.post(`${API}/api/enroll`, {
        user_id: user.id,
        course_id: course.id,
        course_type: getCourseType(course),
      });
      return true;
    } catch {
      alert("Already Enrolled!");
      return false;
    }
  };

  const handleCourseClick = async (course) => {
    const enrolled = await enrollCourse(course);
    if (!enrolled) return;

    if (course.button === "Start Trial") {
      setShowPlansModal(true);
      return;
    }

    if (course.button === "Enroll Now") {
      navigate("/enroll", { state: course });
      return;
    }

    navigate("/checkout", { state: course });
  };

  return (
    <>
      <div className="popular-courses-wrapper">
        {sections.map((section, i) => (
          <section key={i} className="course-section">
            <div className="section-header">
              <div className="title-group">
                <span className="section-indicator" style={{ background: section.color }} />
                <h2>{section.title}</h2>
              </div>
            </div>

            <div className="course-grid">
              {section.courses.map((course) => (
                <div className="course-card" key={course.id}>
                  <div
                    className="card-image"
                    style={{ backgroundImage: `url(${course.image})` }}
                  >
                    {course.tag && <span className="badge">{course.tag}</span>}
                  </div>

                  <div className="card-content">
                    <span className="category">{course.category}</span>
                    <h3 className="card-title">{course.title}</h3>
                    <p className="instructor">{course.instructor}</p>

                    <div className="details-row">
                      <span>⭐ {course.rating}</span>
                      <span>{course.lessons} Lessons</span>
                      <span>{course.duration}</span>
                    </div>

                    <div className="price-row">
                      <span className="price">{course.price}</span>
                      <button className="buy-btn" onClick={() => handleCourseClick(course)}>
                        {course.button}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <TrialPlansModal
        open={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        setOpenSubscription={setShowSubscriptionModal}
      />

      <SubscriptionModal
        open={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default AllCourses;