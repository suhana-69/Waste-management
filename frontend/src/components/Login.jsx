import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // ✅ v5
import api from "../api/api";

function Login() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login", formData);
      const { token, user } = res.data;

      if (!token || !user) throw new Error("Invalid login response");

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name);

      setMessage("✅ Login successful!");
      history.push("/welcome");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-box">
          <h2>Login</h2>
          {message && (
            <p className={message.startsWith("❌") ? "error" : "success"}>
              {message}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f9f9f9;
        }

        .login-box {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .login-box h2 {
          color: #ff4d4d;
          margin-bottom: 20px;
          font-size: 24px;
        }

        .login-box form input,
        .login-box form button {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        .login-box form button {
          background-color: #ff4d4d;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .login-box form button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        .login-box form button:hover:enabled {
          background-color: #e63939;
        }

        .login-box p.success {
          color: green;
          font-weight: bold;
        }

        .login-box p.error {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default Login;
