import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VolunteerDashboard.css";

function VolunteerDashboard() {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [deliveredTasks, setDeliveredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned"); // available, assigned, delivered
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all tasks
  const fetchTasks = async () => {
    setError(null);
    try {
      const [assignedRes, deliveredRes, availableRes] = await Promise.all([
        axios.get("http://localhost:5000/api/volunteer/my-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/volunteer/delivered", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/volunteer/available-tasks", {
          headers: { Authorization: `Bearer ${token}` },
          params: { t: new Date().getTime() }, // force fresh fetch
        }),
      ]);

      // Assigned tasks = assigned to me, not delivered
      setAssignedTasks(
        assignedRes.data.tasks
          .filter((task) => task.status !== "Delivered")
          .map((task) => ({ ...task, status: task.status || "Assigned" })) || []
      );

      // Delivered tasks
      setDeliveredTasks(
        deliveredRes.data.delivered.map((task) => ({ ...task, status: "Delivered" })) || []
      );

      // Available tasks = status Accepted & volunteer null
      setAvailableTasks(
        availableRes.data.tasks
          .filter((task) => task.status === "Accepted" && !task.volunteer)
          .map((task) => ({ ...task, status: "Accepted" })) || []
      );
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(); // initial fetch

    // Auto-refresh every 30s
    const interval = setInterval(fetchTasks, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Mark assigned task as delivered
  const markAsDelivered = async (receiveId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/volunteer/update-status",
        { receiveId, status: "Delivered" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const deliveredTask = { ...response.data.receive, status: "Delivered" };

      setAssignedTasks(assignedTasks.filter((task) => task._id !== receiveId));
      setDeliveredTasks([deliveredTask, ...deliveredTasks]);
    } catch (err) {
      console.error("Error delivering task:", err.response || err);
      alert("Failed to mark task as delivered. Try again.");
    }
  };

  // Pick an available task
  const pickTask = async (taskId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/volunteer/pick-task",
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const pickedTask = { ...response.data.task, status: "Assigned" };

      // Remove from available, add to assigned
      setAvailableTasks(availableTasks.filter((task) => task._id !== taskId));
      setAssignedTasks([pickedTask, ...assignedTasks]);
    } catch (err) {
      console.error("Error picking task:", err.response || err);
      alert("Failed to pick task. Try again.");
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  const tasksToShow =
    activeTab === "assigned"
      ? assignedTasks
      : activeTab === "delivered"
      ? deliveredTasks
      : availableTasks;

  return (
    <div className="dashboard">
      <h1 className="title">Volunteer Dashboard</h1>

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
          {tasksToShow.map((task) => (
            <div key={task._id} className="card">
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
              <p>
                <strong>Donor:</strong> {task.donor?.fullname || "N/A"}
              </p>
              <p>
                <strong>Food:</strong> {task.food?.description || "N/A"}
              </p>
              <p>
                <strong>Receiver:</strong> {task.receiver?.email || "N/A"} (
                {task.receiver?.mobile || "N/A"})
              </p>
              <p>
                <strong>Address:</strong> {task.address || "N/A"}
              </p>
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

              {/* Actions */}
              {activeTab === "assigned" && task.status !== "Delivered" && (
                <div className="actions">
                  <button
                    className="delivered"
                    onClick={() => markAsDelivered(task._id)}
                  >
                    Mark as Delivered
                  </button>
                </div>
              )}

              {activeTab === "available" && (
                <div className="actions">
                  <button
                    className="transit"
                    onClick={() => pickTask(task._id)}
                  >
                    Pick Task
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VolunteerDashboard;
