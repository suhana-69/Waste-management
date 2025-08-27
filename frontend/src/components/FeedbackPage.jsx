import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import api from "../api/api"; // your axios instance
import "./FeedbackPage.css";

// ✅ Feedback form component
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
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Star{num > 1 ? "s" : ""}</option>
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
      <button type="submit" className="btn btn-small">Submit</button>
    </form>
  );
}

// ✅ Main Feedback Page
function FeedbackPage() {
  const [deliveredDonations, setDeliveredDonations] = useState([]);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role"); // "Donor", "NGO", "Volunteer"

  // Fetch delivered donations based on role
  useEffect(() => {
    const fetchDelivered = async () => {
      try {
        let endpoint = "";

        if (role === "Donor") endpoint = "/food/donor-foods";
        else if (role === "NGO") endpoint = "/food/ngo-foods";
        else if (role === "Volunteer") endpoint = "/food/volunteer-foods";

        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter only delivered ones
        const delivered = res.data.foods.filter((f) => f.status === "Delivered");
        setDeliveredDonations(delivered);
      } catch (error) {
        console.error("Error fetching delivered foods:", error.response?.data || error);
        setDeliveredDonations([]);
      }
    };

    if (token) fetchDelivered();
  }, [token, role]);

  return (
    <div>
      <Navbar />
      <main className="section">
        <h1>📝 Feedback Center</h1>

        {deliveredDonations.length === 0 ? (
          <p className="text-muted">No delivered donations available for feedback yet.</p>
        ) : (
          <div className="feedback-list">
            {deliveredDonations.map((d) => (
              <div key={d._id} className="feedback-card">
                <h3>{d.funcname} — {d.description}</h3>
                <p><strong>Quantity:</strong> {d.quantity} ({d.foodtype})</p>
                <FeedbackForm foodId={d._id} userId={currentUserId} role={role} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default FeedbackPage;
