import React, { useState } from "react";
import api from "../api/axios"; // ✅ CHANGED
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const GetStarted = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // ✅ REGISTER
      await api.post("/api/register", {
        name,
        email,
        password,
      });

      // ✅ AUTO LOGIN
      const loginRes = await api.post("/api/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(loginRes.data.user));

      navigate("/");
    } catch (err) {
      alert(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section className="page-header">
          <div className="container">
            <h1>Get Started</h1>
            <p>Create your free account and begin learning today.</p>
          </div>
        </section>

        <section className="container form-card-wrapper">
          <form className="form-card" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <button className="btn btn-primary full-width" type="submit">
              Create Account
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default GetStarted;