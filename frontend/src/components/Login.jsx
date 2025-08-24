import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const { data } = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    console.log("🔥 Full Backend Response:", data);

    const { token, userId, role } = data; // ✅ direct destructuring
    console.log("Parsed:", { token, userId, role });

    if (!token || !userId) {
      throw new Error("Invalid login response from server");
    }

    // Save credentials
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);

    // Redirect based on role
    switch (role.toLowerCase()) {  // ✅ safe lowercase match
      case "donor":
        history.push("/donor-dashboard");
        break;
      case "volunteer":
        history.push("/volunteer-dashboard");
        break;
      case "ngo":
        history.push("/ngo-dashboard");
        break;
      default:
        history.push("/");
    }
  } catch (err) {
    setMessage("❌ Login failed: " + (err.response?.data?.error || err.message));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-container">
      <h2>Login</h2>
      {message && <p className="error">{message}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
