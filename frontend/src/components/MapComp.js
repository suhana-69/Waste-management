import React, { useState } from "react";
import api from "../api/axios"; // use the axios instance with token interceptor

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use api instance (proxy will handle localhost:5000/api)
      const res = await api.post("/users/login", { email, password });

      // Save JWT token to localStorage
      localStorage.setItem("token", res.data.token);

      setMessage("✅ Login successful!");
      console.log("User Data:", res.data);

      // Redirect after login
      window.location.href = "/";
    } catch (err) {
      console.error("Login Error:", err);
      setMessage(
        "❌ Login failed: " +
          (err.response?.data?.error || "Something went wrong")
      );
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
}

export default Login;
