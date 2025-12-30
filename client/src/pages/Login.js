import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <section className="page-header">
          <div className="container">
            <h1>Log in</h1>
            <p>Welcome back! Continue your learning journey.</p>
          </div>
        </section>

        <section className="container form-card-wrapper">
          <form className="form-card" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button className="btn btn-primary full-width" type="submit">
              Log in
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Login;