import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./NgoDashboard.css";

function NgoDashboard() {
  const [pendingFoods, setPendingFoods] = useState([]);
  const [historyFoods, setHistoryFoods] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [sortBy, setSortBy] = useState("");
  const token = localStorage.getItem("token");

  // Fetch Pending Donations
  useEffect(() => {
    const fetchPendingFoods = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/food/pending-foods",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPendingFoods(res.data.foods || []);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    if (token) fetchPendingFoods();
  }, [token]);

  // Fetch Donation History
  useEffect(() => {
    const fetchHistoryFoods = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/food/donation-history",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistoryFoods(res.data.foods || []);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    if (token) fetchHistoryFoods();
  }, [token]);

  const handleAccept = async (foodId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/food/acceptfood",
        { foodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const acceptedFood = pendingFoods.find((f) => f._id === foodId);
      if (acceptedFood) {
        setHistoryFoods((prev) => [
          ...prev,
          { ...acceptedFood, status: "Accepted" },
        ]);
      }
      setPendingFoods((prev) => prev.filter((f) => f._id !== foodId));
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Failed to accept food. Please try again.");
    }
  };

  const renderFoodCard = (food, isPending = false) => {
    const donorName = food.donor?.name || food.donor?.email || "Unknown Donor";
    const donorPhone = food.donor?.mobile || "N/A";
    const donorEmail = food.donor?.email || "N/A";

    return (
      <div key={food._id} className="donation-card">
        <h2 className="food-name">{food.funcname}</h2>

        <div className="food-info">
          <p><strong>Description:</strong> {food.description}</p>
          <p><strong>Quantity:</strong> {food.quantity} ({food.foodtype})</p>
        </div>

        <div className="donor-info">
          <p><strong>Donor:</strong> {donorName}</p>
          <p><strong>Phone:</strong> {donorPhone}</p>
          <p><strong>Email:</strong> {donorEmail}</p>
        </div>

        <div className="address-info">
          <p><strong>Address:</strong> {food.address}, {food.city}, {food.state}</p>
        </div>

        <p className="status">
          <strong>Status:</strong>{" "}
          <span
            className={
              food.status === "Pending"
                ? "pending"
                : food.status === "Accepted"
                ? "accepted"
                : "delivered"
            }
          >
            {food.status}
          </span>
        </p>

        {isPending && food.status === "Pending" && (
          <button className="accept-btn" onClick={() => handleAccept(food._id)}>
            Accept Donation
          </button>
        )}
      </div>
    );
  };

  // Apply filtering & sorting
  const getFilteredAndSortedFoods = (foods) => {
    return foods
      .filter(f =>
        (!filterType || f.foodtype === filterType) &&
        (!filterStatus || f.status === filterStatus) &&
        (!filterCity || f.city.toLowerCase().includes(filterCity.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === "quantity") return b.quantity - a.quantity;
        if (sortBy === "date") return new Date(b.updatedAt) - new Date(a.updatedAt);
        return 0;
      });
  };

  const displayedFoods = activeTab === "pending"
    ? getFilteredAndSortedFoods(pendingFoods)
    : getFilteredAndSortedFoods(historyFoods);

  return (
    <div className="ngo-dashboard">
      <Navbar />
      <main className="dashboard-section">
        <h1>NGO Dashboard</h1>

        <div className="tabs">
          <button
            className={activeTab === "pending" ? "active" : ""}
            onClick={() => setActiveTab("pending")}
          >
            Pending Donations
          </button>
          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            Donation History
          </button>
        </div>

        {/* Filters & Sorting */}
        <div className="filters">
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">All Food Types</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
            <option value="Packed">Packed</option>
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Delivered">Delivered</option>
          </select>

          <input
            type="text"
            placeholder="Filter by City"
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
          />

          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="quantity">Quantity</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Content */}
        {displayedFoods.length === 0 ? (
          <p className="no-donations">No donations found.</p>
        ) : (
          <div className="donation-grid">
            {displayedFoods.map(food => renderFoodCard(food, activeTab === "pending"))}
          </div>
        )}
      </main>
    </div>
  );
}

export default NgoDashboard;
