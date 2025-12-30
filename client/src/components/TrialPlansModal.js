import React from "react";
import { useNavigate } from "react-router-dom";

  const TrialPlansModal = ({ open, onClose, setOpenSubscription }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="wm-overlay">
      <div className="wm-modal">
        <button className="wm-close" onClick={onClose}>✕</button>

        <h2 className="wm-title">Choose your plan</h2>
        <p className="wm-subtitle">Try Pro free for 7 days. No credit card required.</p>

        <div className="wm-plans">

          <div className="wm-plan">
            <h3>Hobby</h3>
            <p className="wm-plan-sub">For personal learning</p>

            <div className="wm-price">
              <span className="wm-amount">$0</span><span>/mo</span>
            </div>

            <ul className="wm-features">
              <li> 1 Project</li>
              <li> Community Support</li>
              <li> 1GB Storage</li>
            </ul>

            <button
              className="wm-btn-outlined"
              onClick={() => navigate("/get-started")}
            >
              Get Started
            </button>
          </div>

          <div className="wm-plan wm-popular">
            <div className="wm-popular-badge">Most Popular</div>

            <h3>Pro</h3>
            <p className="wm-plan-sub">Best for students & professionals</p>

            <div className="wm-price">
              <span className="wm-amount">$29</span><span>/mo</span>
            </div>

            <p className="wm-trial-line">Includes 7-day free trial</p>

            <ul className="wm-features">
              <li> Unlimited Projects</li>
              <li> Priority Support</li>
              <li> 10GB Storage</li>
              <li> Team Access</li>
            </ul>

            <button
              className="wm-btn-primary"
              onClick={() => {
                onClose();
                setOpenSubscription(true); 
              }}
            >
              Start Free Trial
            </button>
          </div>

          <div className="wm-plan">
            <h3>Enterprise</h3>
            <p className="wm-plan-sub">For large teams</p>

            <div className="wm-price">
              <span className="wm-amount">Custom</span>
            </div>

            <ul className="wm-features">
              <li> Everything in Pro</li>
              <li> Dedicated Manager</li>
              <li> SSO / Advanced Security</li>
            </ul>

            <button
              className="wm-btn-outlined"
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrialPlansModal;
