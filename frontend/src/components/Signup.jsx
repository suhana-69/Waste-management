import React, { useState } from "react";
import api from "../api/axios"; // your axios instance
import { useHistory } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    mobile: "",
    gender: "",
    type: "Donor",
    address: "",
    city: "",
    state: "",
    url: "",
  });

  const [message, setMessage] = useState("");
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", formData);

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect based on user type
      const role = res.data.type;
      if (role === "Donor") {
        history.push("/donor-dashboard");
      } else if (role === "Volunteer") {
        history.push("/volunteer-dashboard");
      } else if (role === "NGO") {
        history.push("/ngo-dashboard");
      } else {
        history.push("/");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Signup failed: " + (err.response?.data?.error || "Server error"));
    }
  };

  return (
    <div className="form-container">
      <h2>Signup</h2>
      {message && <p>{message}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
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

        {/* Gender and Type */}
        <div style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="Donor">Donor</option>
            <option value="NGO">NGO</option>
            <option value="Volunteer">Volunteer</option>
          </select>
        </div>

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
          type="text"
          name="url"
          placeholder="Profile / Org URL"
          value={formData.url}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
