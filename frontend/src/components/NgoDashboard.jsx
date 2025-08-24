import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";

function NgoDashboard() {
  const [pendingFoods, setPendingFoods] = useState([]);
  const token = localStorage.getItem("token"); // NGO token

  useEffect(() => {
    const fetchPendingFoods = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/food/pending-foods",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Pending foods response:", res.data);
        setPendingFoods(res.data.foods || []);
      } catch (err) {
        console.error("Error fetching pending foods:", err.response?.data || err);
      }
    };

    if (token) fetchPendingFoods();
  }, [token]);

  // ✅ Accept Food
  const handleAccept = async (foodId) => {
    console.log("Accepting foodId:", foodId, "Token:", token);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/food/acceptfood",
        { foodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Food accepted:", res.data);

      // Remove the accepted food from the pending list
      setPendingFoods((prev) => prev.filter((food) => food._id !== foodId));
    } catch (err) {
      console.error("Error accepting food:", err.response?.data || err);
      alert("Failed to accept food. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="section" style={{ padding: "20px" }}>
        <h1>NGO Dashboard</h1>

        {pendingFoods.length === 0 ? (
          <p>No pending donations available.</p>
        ) : (
          <div className="donation-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {pendingFoods.map((food) => (
              <div
                key={food._id}
                className="donation-card"
                style={{
                  padding: "15px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  background: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <h2>{food.funcname}</h2>
                <p><strong>Description:</strong> {food.description}</p>
                <p><strong>Quantity:</strong> {food.quantity} ({food.foodtype})</p>

                {/* Donor Info */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <span><strong>Donor:</strong> {food.donor ? food.donor.name : "N/A"}</span>
                  <span>{food.donor ? food.donor.mobile : ""}</span>
                  <span>{food.donor ? food.donor.email : ""}</span>
                </div>

                {/* Address Info */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <span><strong>Address:</strong> {food.address}</span>
                  <span>{food.city}</span>
                  <span>{food.state}</span>
                </div>

                <p><strong>Status:</strong> {food.status}</p>

                {/* Accept Button */}
                {food.status === "Pending" && (
                  <button
                    onClick={() => handleAccept(food._id)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 12px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Accept Donation
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default NgoDashboard;
