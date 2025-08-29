import React, { useEffect, useState } from "react";
import "./VolunteerDashboard.css";

function VolunteerDashboard() {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [deliveredTasks, setDeliveredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned"); // available, assigned, delivered
  const [error, setError] = useState(null);

  // ✅ Demo Data only
  const demoAssigned = [
    {
      status: "Assigned",
      donor: { fullname: "Rahul Sharma" },
      food: { description: "Vegetarian meal for 50 people" },
      receiver: { email: "receiver1@gmail.com", mobile: "9876543210" },
      address: "Park Street, Kolkata",
      exptime: "2025-08-29T15:30:00",
    },
    {
      status: "Assigned",
      donor: { fullname: "Priya Mehta" },
      food: { description: "Biryani packets for 30 people" },
      receiver: { email: "priyameheta@gmail.com", mobile: "9123456789" },
      address: "Salt Lake Sector 5, Kolkata",
      exptime: "2025-08-29T18:00:00",
    },
     {
      status: "Assigned",
      donor: { fullname: "Arohi Sen" },
      food: { description: "Veg rice and vegetables for 80 people" },
      receiver: { email: "arohisen@gmail.com", mobile: "9123456789" },
      address: "Salt Lake Sector 5, Kolkata",
      exptime: "2025-08-29T18:00:00",
    },

  ];

  const demoDelivered = [
    {
      status: "Delivered",
      donor: { fullname: "Amit Verma" },
      food: { description: "Snacks for 20 people" },
      receiver: { email: "amit3@gmail.com", mobile: "9988776655" },
      address: "Howrah, Kolkata",
      exptime: "2025-08-27T14:00:00",
      deliveredAt: "2025-08-28T00:12:41",
    },
    {
      status: "Delivered",
      donor: { fullname: "Zoha Chahan" },
      food: { description: "70 Glass Fresh fruit jucies" },
      receiver: { email: "zoha3@gmail.com", mobile: "9988776655" },
      address: "Howrah, Kolkata",
      exptime: "2025-08-27T14:00:00",
      deliveredAt: "2025-08-28T00:12:41",
    },
  ];

  const demoAvailable = [
    {
      status: "Available",
      donor: { fullname: "Rahul Sharma" },
      food: { description: "Roti & Sabzi for 40 people" },
      receiver: { email: "rahull@gmail.com", mobile: "9000000000" },
      address: "New Town, Kolkata",
      exptime: "2025-08-29T20:00:00",
    },
    
     {
      status: "Available",
      donor: { fullname: "Ria Sen" },
      food: { description: "Rice , sweets and paneer" },
      receiver: { email: "riasen4@gmail.com", mobile: "9000000000" },
      address: "New Town, Kolkata",
      exptime: "2025-08-29T20:00:00",
    },
    {
      status: "Available",
      donor: { fullname: "Rahul Sharma" },
      food: { description: "Biriyani and chicken curry" },
      receiver: { email: "rahuls@gmail.com", mobile: "9000000000" },
      address: "New Town, Kolkata",
      exptime: "2025-08-29T20:00:00",
    },
    

  ];

  // ✅ Just load demo data directly (ignore API for now)
  useEffect(() => {
    setAssignedTasks(demoAssigned);
    setDeliveredTasks(demoDelivered);
    setAvailableTasks(demoAvailable);
    setError(".");
    setLoading(false);
  }, []);

  const tasksToShow =
    activeTab === "assigned"
      ? assignedTasks
      : activeTab === "delivered"
      ? deliveredTasks
      : availableTasks;

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="dashboard">
      <h1 className="title">Volunteer Dashboard</h1>
      {error && <p className="error">{error}</p>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "assigned" ? "tab active" : "tab"}
          onClick={() => setActiveTab("assigned")}
        >
          Assigned Tasks
        </button>
        <button
          className={activeTab === "delivered" ? "tab active" : "tab"}
          onClick={() => setActiveTab("delivered")}
        >
          Delivered Tasks
        </button>
        <button
          className={activeTab === "available" ? "tab active" : "tab"}
          onClick={() => setActiveTab("available")}
        >
          Available Tasks
        </button>
      </div>

      {/* Task Cards */}
      {tasksToShow.length === 0 ? (
        <p className="no-tasks">No {activeTab} tasks yet.</p>
      ) : (
        <div className="card-container">
          {tasksToShow.map((task, index) => (
            <div key={index} className="card">
              <h2>
                Status:{" "}
                <span
                  className={
                    task.status === "Delivered"
                      ? "delivered"
                      : task.status === "Assigned"
                      ? "transit"
                      : "accepted"
                  }
                >
                  {task.status || "N/A"}
                </span>
              </h2>
              <p><strong>Donor:</strong> {task.donor?.fullname || "N/A"}</p>
              <p><strong>Food:</strong> {task.food?.description || "N/A"}</p>
              <p>
                <strong>Receiver:</strong> {task.receiver?.email || "N/A"} (
                {task.receiver?.mobile || "N/A"})
              </p>
              <p><strong>Address:</strong> {task.address || "N/A"}</p>
              <p>
                <strong>Expiry:</strong>{" "}
                {task.exptime ? new Date(task.exptime).toLocaleString() : "N/A"}
              </p>
              {task.deliveredAt && (
                <p>
                  <strong>Delivered At:</strong>{" "}
                  {new Date(task.deliveredAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VolunteerDashboard;
