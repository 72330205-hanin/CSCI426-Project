import React from "react";
import "../assets/styles/officeHoursModal.css";

const OfficeHoursModal = ({
  open,
  onClose,
  onConfirm,
  title = "Success!",
  message = "You can visit our company during the following hours:",
  buttonText = "Got it, Thanks!",
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    onClose();
    if (onConfirm) setTimeout(() => onConfirm(), 0);
  };

  return (
    <div className="oh-overlay" onClick={onClose}>
      <div
        className="oh-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="oh-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>

        <div className="oh-icon">
          <div className="oh-check">✓</div>
        </div>

        <h2 className="oh-title">{title}</h2>
        <p className="oh-text">{message}</p>

        <div className="oh-box">
          <div className="oh-box-title">Office Hours</div>
          <div className="oh-box-days">Monday to Friday</div>
          <div className="oh-box-time">8:00 AM – 5:00 PM</div>
        </div>

        <button className="oh-btn" onClick={handleConfirm} type="button">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default OfficeHoursModal;
