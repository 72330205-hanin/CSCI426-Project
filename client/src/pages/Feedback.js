import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FeedbackSuccessModal from "../components/FeedbackSuccessModal";
import "../assets/styles/feedback.css";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const alertShown = useRef(false); 

  const [courseName, setCourseName] = useState(
    location.state?.courseName || ""
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [canGiveFeedback, setCanGiveFeedback] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const showAlertOnce = () => {
      if (!alertShown.current) {
        alert("Only enrolled students can give feedback");
        alertShown.current = true;
      }
    };

    if (!user) {
      showAlertOnce();
      setChecked(true);
      return;
    }

    axios
      .get(`http://localhost:5000/api/enrollments/${user.id}`)
      .then((res) => {
        if (res.data.length > 0) {
          setCanGiveFeedback(true);
        } else {
          showAlertOnce();
        }
      })
      .catch(() => {
        showAlertOnce();
      })
      .finally(() => {
        setChecked(true);
      });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canGiveFeedback) {
      alert("Only enrolled students can give feedback");
      return;
    }

    try {
     await axios.post("http://localhost:5000/api/feedback", {
  user_id: user?.id,
  user_name: user?.name,
  course_name: courseName,
  rating,
  feedback_message: feedback,
});

      setSuccessOpen(true);
    } catch {
      alert("Failed to submit feedback");
    }
  };

  const handleCloseModal = () => {
    setSuccessOpen(false);
    navigate("/courses");
  };

  if (!checked) return null;

  return (
    <>
      <Navbar />

      <main className="fb-page">
        <div className="fb-hero">
          <h1>Course Feedback</h1>
          <p>Only enrolled students can submit feedback.</p>
        </div>

        {canGiveFeedback && (
          <div className="fb-card">
            <h3>Submit Your Feedback</h3>

            <form onSubmit={handleSubmit}>
              <label className="fb-label">Course Name</label>
              <input
                className="fb-input"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                required
              />

              <label className="fb-label">Rate Your Experience</label>
              <div className="fb-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`fb-star ${
                      star <= (hover || rating) ? "active" : ""
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label className="fb-label">Your Feedback</label>
              <textarea
                className="fb-textarea"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />

              <button type="submit" className="fb-submit">
                Submit Feedback
              </button>
            </form>
          </div>
        )}
      </main>

      <FeedbackSuccessModal
        open={successOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </>
  );
};

export default Feedback;