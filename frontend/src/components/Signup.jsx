import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // ✅ v5 hook
import api from "../api/api";

function Signup() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
    role: "donor",
    address: "",
    city: "",
    state: "",
    url: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", formData);

      localStorage.setItem("token", res.data.token);

      setMessage("✅ Signup successful!");
      history.push("/welcome");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Signup failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="signup-wrapper">
        <div className="signup-box">
          <h2>Signup</h2>
          {message && (
            <p className={message.startsWith("❌") ? "error" : "success"}>
              {message}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="donor">Donor</option>
              <option value="ngo">NGO</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <input
              type="url"
              name="url"
              placeholder="Profile URL"
              value={formData.url}
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>
        </div>
      </div>

      {/* Inline CSS */}
      <style>{`
   .signup-wrapper {
  min-height: 100vh;
  padding-top: 100px;  /* enough space for navbar */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* start below navbar */
  background: #f9f9f9;
}


        .signup-box {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        .signup-box h2 {
          color: #ff4d4d;
          margin-bottom: 20px;
          font-size: 24px;
        }

        .signup-box form input,
        .signup-box form select,
        .signup-box form button {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        .signup-box form button {
          background-color: #ff4d4d;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }

        .signup-box form button:disabled {
          background-color: #aaa;
          cursor: not-allowed;
        }

        .signup-box form button:hover:enabled {
          background-color: #e63939;
        }

        .signup-box p.success {
          color: green;
          font-weight: bold;
        }

        .signup-box p.error {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </>
  );
}

export default Signup;
