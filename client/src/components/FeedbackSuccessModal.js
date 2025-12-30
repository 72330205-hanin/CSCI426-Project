import React from "react";
import "../assets/styles/feedback.css";

const FeedbackSuccessModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fb-modal-overlay"
      onClick={onClose}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className="fb-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="fb-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="fb-modal-icon">
          <div className="fb-modal-check">✓</div>
        </div>

        <h2 className="fb-modal-title">Thank You!</h2>

        <p className="fb-modal-text">
          Your feedback has been submitted successfully. We appreciate you taking
          the time to help us improve our courses.
        </p>

        <button className="fb-modal-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default FeedbackSuccessModal;
