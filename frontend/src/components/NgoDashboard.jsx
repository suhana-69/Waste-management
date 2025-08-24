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
    <div style={{ background: "#f7f9fc", minHeight: "100vh" }}>
      <Navbar />
      <main className="section" style={{ padding: "40px 20px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2.2rem",
            color: "#2c3e50",
            fontWeight: "700",
          }}
        >
          NGO Dashboard
        </h1>

        {pendingFoods.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
            No pending donations available.
          </p>
        ) : (
          <div
            className="donation-list"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {pendingFoods.map((food) => (
              <div
                key={food._id}
                className="donation-card"
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                <h2 style={{ color: "#ff3b3f", marginBottom: "10px" }}>
                  {food.funcname}
                </h2>
                <p><strong>Description:</strong> {food.description}</p>
                <p><strong>Quantity:</strong> {food.quantity} ({food.foodtype})</p>

                {/* Donor Info */}
                <div style={{ marginTop: "10px", fontSize: "0.95rem" }}>
                  <p><strong>Donor:</strong> {food.donor ? food.donor.name : "N/A"}</p>
                  <p>{food.donor ? food.donor.mobile : ""}</p>
                  <p>{food.donor ? food.donor.email : ""}</p>
                </div>

                {/* Address Info */}
                <div style={{ marginTop: "10px", fontSize: "0.95rem" }}>
                  <p><strong>Address:</strong> {food.address}, {food.city}, {food.state}</p>
                </div>

                {/* Status */}
                <p style={{ marginTop: "10px" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: food.status === "Pending" ? "#e67e22" : "#28a745",
                      fontWeight: "bold",
                    }}
                  >
                    {food.status}
                  </span>
                </p>

                {/* Accept Button */}
                {food.status === "Pending" && (
                  <button
                    onClick={() => handleAccept(food._id)}
                    style={{
                      marginTop: "15px",
                      padding: "10px 16px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: "600",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#218838")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#28a745")
                    }
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
