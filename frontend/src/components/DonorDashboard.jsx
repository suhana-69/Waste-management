import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./DonorDashboard.css";
import api from "../api/api"; // preconfigured axios instance

// Feedback form component
function FeedbackForm({ foodId, userId, role }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", { food: foodId, user: userId, role, rating, comment });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error.response?.data || error);
      alert("Failed to submit feedback. Try again.");
    }
  };

  if (submitted) return <p>✅ Thank you for your feedback!</p>;

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h4>Leave Feedback</h4>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
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

// Donor Dashboard Component
function DonorDashboard() {
  const [donations, setDonations] = useState([]);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // Redirect if token missing or invalid
  useEffect(() => {
    if (!token) {
      alert("Session expired! Please login again.");
      localStorage.clear();
      window.location.href = "/login";
    }
  }, [token]);

  // Fetch all donations of the logged-in donor
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get("/food/donor-foods", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched donations:", res.data);
        // Ensure 'foods' key exists
        if (res.data && res.data.foods) setDonations(res.data.foods);
        else setDonations([]);
      } catch (error) {
        console.error("Error fetching donations:", error.response?.data || error);
        setDonations([]);
      }
    };

    if (token) fetchDonations();
  }, [token]);

  // Add a new donation
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
      lat: 0,
      lng: 0,
    };

    try {
      const res = await api.post("/food/addfood", donationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations([res.data.food, ...donations]);
      e.target.reset();
    } catch (error) {
      console.error("Error adding donation:", error.response?.data || error);
      alert("Failed to add donation. Try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="section">
        <h1>🍲 Donor Dashboard</h1>

        {/* Add Donation Form */}
        <form onSubmit={handleAddDonation} className="donation-form">
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
          <button type="submit" className="btn">Add Donation</button>
        </form>

        {/* Donations List */}
{/* Donations List */}
{/* Donations List */}

<h2>📋 My Donations</h2>
{donations.length === 0 ? (
  <p className="text-muted">No donations yet</p>
) : (
  <div className="donation-grid">
    {donations.map((d) => (
      <div key={d._id} className="donation-card">
        <strong>{d.funcname}</strong> — {d.description}
        <br />
        {d.quantity} ({d.foodtype}) | Status: {d.status || "Pending"}
        <br />
        <strong>Donor Contact:</strong> {d.name} | {d.mobile}
        {localStorage.getItem("email") && ` | ${localStorage.getItem("email")}`}
        {d.status === "Delivered" && (
          <FeedbackForm foodId={d._id} userId={currentUserId} role="Donor" />
        )}
      </div>
    ))}
  </div>
)}


      </main>
    </div>
  );
}

export default DonorDashboard;
