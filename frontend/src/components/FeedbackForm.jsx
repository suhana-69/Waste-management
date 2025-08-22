import React, { useState } from "react";
import axios from "axios";
import "./FeedbackForm.css"; // optional styling

function FeedbackForm({ foodId, userId, role, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:5000/api/feedback", {
      foodId,
      rating,
      comment,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // or wherever you store JWT
      }
    });

    setMessage("✅ Feedback submitted successfully!");
    setRating(5);
    setComment("");

    if (onSubmit) onSubmit(); // optional callback
  } catch (err) {
    setMessage("❌ Failed to submit feedback.");
    console.error(err);
  }
};

 
  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h4>Leave Feedback</h4>
      {message && <p>{message}</p>}

      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(e.target.value)} required>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>
      </label>

      <textarea
        placeholder="Comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit" className="btn">Submit Feedback</button>
    </form>
  );
}

export default FeedbackForm;
