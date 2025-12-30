import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/enrollmentSuccessModal.css";

const EnrollmentSuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoCourses = () => {
    onClose();
    setTimeout(() => navigate("/courses"), 0);
  };

  return (
    <div
      className="enroll-modal-overlay"
      onClick={onClose}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="enroll-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-modal-title"
      >
        <button
          className="enroll-modal-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>

        <div className="enroll-modal-icon">
          <div className="enroll-modal-check">✓</div>
        </div>

        <h2 id="enroll-modal-title" className="enroll-modal-title">
          Enrollment Successful!
        </h2>

        <p className="enroll-modal-text">
          Your enrollment has been confirmed. You can visit our company:
        </p>

        <div className="enroll-modal-hours">
          <div className="hours-title">Office Hours</div>
          <div className="hours-days">Monday to Friday</div>
          <div className="hours-time">8:00 AM – 5:00 PM</div>
          <div className="loc">Tyre – Behind LIU Campus</div>
        </div>

        <button
          className="enroll-modal-btn"
          onClick={handleGoCourses}
          type="button"
        >
          Got it, Thanks!
        </button>
      </div>
    </div>
  );
};

export default EnrollmentSuccessModal;
