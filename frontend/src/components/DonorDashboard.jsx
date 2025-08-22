import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./DonorDashboard.css";
import axios from "axios";

// FeedbackForm Component remains the same
function FeedbackForm({ foodId, userId, role }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/feedback", {
        food: foodId,
        user: userId,
        role,
        rating,
        comment,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (submitted) return <p>✅ Thank you for your feedback!</p>;

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h4>Leave Feedback</h4>
      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Your feedback"
        />
      </label>
      <button type="submit" className="btn btn-small">
        Submit Feedback
      </button>
    </form>
  );
}

// DonorDashboard Component
function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // Helper: check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return true;
    }
  };

  // Redirect if token missing or expired
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      alert("Session expired! Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
  }, [token]);

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/food/viewdonatedfood",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDonations(res.data.foods || []);
      } catch (error) {
        console.error("Error fetching donations:", error.response?.data || error);
        setDonations([]);
      }
    };
    if (token && !isTokenExpired(token)) fetchDonations();
  }, [token]);

  // Add new donation
  const handleAddDonation = async (e) => {
  e.preventDefault();

  const donationData = {
    funcname: e.target.funcname.value,
    name: e.target.name.value,
    mobile: e.target.mobile.value,
    description: e.target.description.value,
    quantity: e.target.quantity.value,
    foodtype: e.target.foodtype.value,
    cookedtime: e.target.cookedtime.value,
    expirytime: e.target.expirytime.value,
    address: e.target.address.value,
    city: e.target.city.value,
    state: e.target.state.value,
    lat: 0, // optional, or leave blank
    lng: 0  // optional
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/food/donate",
      donationData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDonations([...donations, res.data.food]);
    e.target.reset();
  } catch (error) {
    console.error("Error adding donation:", error.response?.data || error);
  }
};


  return (
    <div>
      <Navbar />
      <main className="section">
        <h1>🍲 Donor Dashboard</h1>

        <form onSubmit={handleAddDonation} className="donation-form" encType="multipart/form-data">
          <input name="funcname" placeholder="Function / Event Name" className="input" required />
          <input name="name" placeholder="Contact Person Name" className="input" required />
          <input name="mobile" type="tel" placeholder="Mobile Number" className="input" required />
          <textarea name="description" placeholder="Food Description" className="input" required />
          <input name="quantity" placeholder="Quantity" className="input" required />
          <select name="foodtype" className="input" required>
            <option value="">Select Food Type</option>
            <option value="Veg">Vegetarian</option>
            <option value="Non-Veg">Non-Vegetarian</option>
            <option value="Packed">Packed</option>
          </select>
          <input name="cookedtime" type="time" className="input" required />
          <input name="expirytime" type="datetime-local" className="input" required />
          <input name="address" placeholder="Full Address" className="input" required />
          <input name="city" placeholder="City" className="input" required />
          <input name="state" placeholder="State" className="input" required />
          <input type="file" name="image" accept="image/*" className="input" />
          <button type="submit" className="btn">Add Donation</button>
        </form>

        <h2>📋 My Donations</h2>
        <ul className="donation-list">
          {donations.length === 0 ? (
            <p className="text-muted">No donations yet</p>
          ) : (
            donations.map((d) => (
              <li key={d._id} className="donation-card">
                <strong>{d.funcname}</strong> — {d.description}
                <br />
                {d.quantity} ({d.foodtype}) | Status: {d.status || "Pending"}
                {d.status === "Delivered" && (
                  <FeedbackForm foodId={d._id} userId={currentUserId} role="Donor" />
                )}
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}

export default DonorDashboard;
