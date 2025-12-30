import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../assets/styles/enroll.css";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import LockIcon from "@mui/icons-material/Lock";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EmailIcon from "@mui/icons-material/Email";
import SecurityIcon from "@mui/icons-material/Security";
import OfficeHoursModal from "../components/OfficeHoursModal";

const CourseCheckout = () => {
  const location = useLocation();
  const course = location.state; 
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [total, setTotal] = useState(0);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paySuccessOpen, setPaySuccessOpen] = useState(false);
  const basePrice = Number(String(course?.price || "$0").replace("$", ""));

  const isAccountFilled =
    user.firstName.trim() !== "" &&
    user.lastName.trim() !== "" &&
    user.email.trim() !== "";

  const handlePay = () => {
    setPaySuccessOpen(true);
  };

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="checkout-wrapper">
          <div className="checkout-left">
            <h1 style={{ color: "red" }}>Error: No course data received.</h1>
            <button
              type="button"
              className="continue-btn"
              onClick={() => navigate("/courses")}
            >
              Go Back to Courses
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="checkout-wrapper">
        <div className="checkout-left">
          <h1>Complete your enrollment</h1>

          <div className="step">
            <div className="step-title">
              <span>1</span> Select your plan
            </div>

            <div className="plan-row">
              <div
                className={`plan-box ${selectedPlan === "standard" ? "active" : ""}`}
                onClick={() => {
                  setSelectedPlan("standard");
                  setTotal(basePrice);
                  setStep(2);
                }}
              >
                <h4>Standard</h4>
                <p className="price">${basePrice}</p>
                <ul>
                  <p>✔ Full course access</p>
                  <p>✔ Certificate</p>
                </ul>
              </div>

              <div
                className={`plan-box ${selectedPlan === "pro" ? "active" : ""}`}
                onClick={() => {
                  setSelectedPlan("pro");
                  setTotal(basePrice + 50);
                  setStep(2);
                }}
              >
                <span className="recommended">RECOMMENDED</span>
                <h4>Pro Access</h4>
                <p className="price">${basePrice + 50}</p>
                <ul>
                  <p>✔ Everything in Standard</p>
                  <p>✔ 1-on-1 Mentorship</p>
                  <p>✔ Code Reviews</p>
                </ul>
              </div>
            </div>
          </div>

          {step >= 2 && (
            <div className="step">
              <div className="step-title">
                <span>2</span> Account Information
              </div>

              <div className="form-row">
                <input
                  placeholder="First Name"
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                />
                <input
                  placeholder="Last Name"
                  value={user.lastName}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                />
              </div>

              <input
                placeholder="Email Address"
                className="full"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />

              {isAccountFilled && (
                <button
                  type="button"
                  className="continue-btn"
                  onClick={() => setStep(3)}
                >
                  Continue to Payment
                </button>
              )}
            </div>
          )}

          {step >= 3 && (
            <div className="step">
              <div className="step-title">
                <span>3</span> Payment Details
              </div>

              <div className="payment-box-wrapper">
                <div className="payment-tabs">
                  <button
                    type="button"
                    className={paymentMethod === "card" ? "active" : ""}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCardIcon style={{ marginRight: 6 }} /> Card
                  </button>

                  <button
                    type="button"
                    className={paymentMethod === "paypal" ? "active" : ""}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <PaymentIcon style={{ marginRight: 6 }} /> PayPal
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="payment-content">
                    <label className="payment-label">Card Number</label>

                    <div className="payment-input icon-field">
                      <CreditCardIcon className="input-icon" />
                      <input placeholder="0000 0000 0000 0000" />
                    </div>

                    <div className="payment-row">
                      <div className="payment-group">
                        <label className="payment-label">Expiry Date</label>
                        <div className="payment-input icon-field">
                          <CalendarMonthIcon className="input-icon" />
                          <input placeholder="MM / YY" />
                        </div>
                      </div>

                      <div className="payment-group">
                        <label className="payment-label">CVC</label>
                        <div className="payment-input icon-field">
                          <LockIcon className="input-icon" />
                          <input placeholder="123" />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="pay-submit"
                      onClick={handlePay}
                    >
                      Pay ${total}.00
                    </button>

                    <p className="secure-note">
                      <SecurityIcon style={{ fontSize: 18, marginRight: 4 }} />
                      Payments are secure and encrypted
                    </p>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="payment-content">
                    <label className="payment-label">PayPal Email</label>

                    <div className="payment-input icon-field">
                      <EmailIcon className="input-icon" />
                      <input placeholder="your@email.com" />
                    </div>

                    <button
                      type="button"
                      className="pay-submit"
                      style={{ background: "#2563eb", color: "white" }}
                      onClick={handlePay}
                    >
                      Pay with PayPal (${total}.00)
                    </button>

                    <p className="secure-note">
                      <SecurityIcon style={{ fontSize: 18, marginRight: 4 }} />
                      Redirecting you to PayPal securely
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>

          <p>{course.title}</p>

          <div className="summary-line">
            <span>Plan:</span>
            <span>
              {selectedPlan === "standard"
                ? "Standard"
                : selectedPlan === "pro"
                ? "Pro Access"
                : "-"}
            </span>
          </div>

          <div className="summary-line">
            <span>Subtotal:</span>
            <span>${total}</span>
          </div>

          <div className="summary-line">
            <span>Tax:</span>
            <span>$0.00</span>
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      <OfficeHoursModal
  open={paySuccessOpen}
  onClose={() => setPaySuccessOpen(false)}
  onConfirm={() => navigate("/courses")}   
  title="Payment Successful!"
  message="Your payment was successful. You can come to our company from Monday to Friday from 8:00 AM till 5:00 PM in order to take the course with us."
  buttonText="Got it, Thanks!"
/>

      <Footer />
    </>
  );
};

export default CourseCheckout;