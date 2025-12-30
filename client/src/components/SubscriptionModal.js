import React, { useEffect, useState } from "react";
import "../assets/styles/subscription.css";

const SubscriptionModal = ({ open, onClose }) => {
  const [showOfficeInfo, setShowOfficeInfo] = useState(false);

  useEffect(() => {
    if (open) setShowOfficeInfo(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="trial-overlay" onClick={onClose}>
      <div className="trial-modal" onClick={(e) => e.stopPropagation()}>
        <button className="trial-close" onClick={onClose}>×</button>

        {showOfficeInfo ? (
          <>
            <div className="trial-icon">
              <div className="trial-check">✓</div>
            </div>

            <h2 className="trial-title">Trial Started Successfully!</h2>

            <p className="trial-text">
              You can start your trial in the coming days by visiting our
              company during the following hours:
            </p>

            <div className="office-box">
              <div className="office-title">Office Hours</div>
              <div className="office-days">Monday to Friday</div>
              <div className="office-time">8:00 AM – 5:00 PM</div>
            </div>

            <button className="trial-btn" onClick={onClose}>
              Got it, Thanks!
            </button>
          </>
        ) : (
          <>
            <div className="trial-icon">
              <div className="trial-check">✓</div>
            </div>

            <h2 className="trial-title">Trial Started Successfully!</h2>

            <p className="trial-text">
              Your free trial has been activated. No payment required during the
              trial period.
            </p>

            <div className="trial-box trial-box-blue">
              <div className="trial-box-title">Payment Information</div>
              <div className="trial-box-text">
                After trial ends, you'll be charged <b>$29.99/month</b>
              </div>
              <div className="trial-box-sub">
                Accepted payment methods: Visa, Mastercard, PayPal
              </div>
            </div>

            <div className="trial-box trial-box-yellow">
              <div className="trial-warn-title">Common issues:</div>
              <ul className="trial-warn-list">
                <li>Cancel anytime before trial ends to avoid charges</li>
                <li>Check your deadline for your free trail</li>
              </ul>
            </div>

            <button
              className="trial-btn"
              onClick={() => setShowOfficeInfo(true)}
            >
              Start Learning
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModal;
