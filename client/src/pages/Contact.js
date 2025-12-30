import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const Contact = () => {
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/contact",
        form
      );

      setSuccess(res.data.message);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        subject: "",
        message: ""
      });

      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      alert("Failed to send message");
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <Navbar />

        <div className="contact-left">
          <h2>Send us a message</h2>
          <p>Fill out the form below and our team will get back to you within 24 hours.</p>

          {success && <p className="success-msg">{success}</p>}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="input-group">
                <label>First Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your first name"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your last name"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>Subject</label>
              <select
                required
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
              >
                <option value="">Select a topic</option>
                <option value="course-enquiry">Course Enquiry</option>
                <option value="technical-support">Technical Support</option>
                <option value="account-issues">Account Issues</option>
                <option value="payment-questions">Payment / Billing</option>
                <option value="feedback">Feedback / Suggestions</option>
                <option value="partnership">Partnership / Collaboration</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Message</label>
              <textarea
                required
                placeholder="Tell us more about your inquiry..."
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </div>

            <button type="submit" className="send-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-right">
          <h2>Contact Information</h2>

          <div className="info-box">
            <div className="icon-wrapper">
              <EmailOutlinedIcon />
            </div>
            <div>
              <h4>Email</h4>
              <p>support@learnhub.com</p>
              <small>We’ll respond within 24 hours</small>
            </div>
          </div>

          <div className="info-box">
            <div className="icon-wrapper">
              <PhoneOutlinedIcon />
            </div>
            <div>
              <h4>Phone</h4>
              <p>+1 (555) 123-4567</p>
              <small>Mon–Fri, 9am–6pm EST</small>
            </div>
          </div>

          <div className="info-box">
            <div className="icon-wrapper">
              <LocationOnOutlinedIcon />
            </div>
            <div>
              <h4>Office</h4>
              <p>123 Learning Street</p>
              <small>San Francisco, CA 94102</small>
            </div>
          </div>

          <div className="info-box">
            <div className="icon-wrapper">
              <AccessTimeOutlinedIcon />
            </div>
            <div>
              <h4>Support Hours</h4>
              <p>Monday - Friday</p>
              <small>9:00 AM - 6:00 PM EST</small>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;