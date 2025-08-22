import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

function NgoDashboard() {
  const [pendingFoods, setPendingFoods] = useState([]);
  const token = localStorage.getItem("token"); // NGO token

  useEffect(() => {
    const fetchPendingFoods = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/food/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingFoods(res.data.foods || []);
      } catch (err) {
        console.error("Error fetching pending foods:", err.response?.data || err);
      }
    };

    if (token) fetchPendingFoods();
  }, [token]);

  return (
    <div>
      <Navbar />
      <main className="section">
        <h1>NGO Dashboard</h1>

        {pendingFoods.length === 0 ? (
          <p>No pending donations available.</p>
        ) : (
          <ul className="donation-list">
            {pendingFoods.map((food) => (
              <li key={food._id} className="donation-card">
                <strong>{food.funcname}</strong> — {food.description} <br />
                Quantity: {food.quantity} ({food.foodtype}) <br />
                Donor: {food.donor.name} | {food.donor.mobile} | {food.donor.email} <br />
                Address: {food.address}, {food.city}, {food.state} <br />
                Status: {food.status}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default NgoDashboard;
