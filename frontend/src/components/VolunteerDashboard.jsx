import React, { useState } from "react";
import Navbar from "./Navbar";
import "./VolunteerDashboard.css";

function VolunteerDashboard() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (e) => {
    e.preventDefault();

    const newTask = {
      donor: e.target.donor.value,
      ngo: e.target.ngo.value,
      foodItem: e.target.foodItem.value,
      location: e.target.location.value,
      status: "Assigned",
      assignedAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    e.target.reset();
  };

  return (
    <div>
      <Navbar />

      <main className="section volunteer-dashboard">
        <h1>Volunteer Dashboard</h1>

        <form onSubmit={handleAddTask} className="volunteer-form">
          <input
            name="donor"
            placeholder="Donor Name"
            className="input"
            required
          />
          <input
            name="ngo"
            placeholder="NGO Name"
            className="input"
            required
          />
          <input
            name="foodItem"
            placeholder="Food Item"
            className="input"
            required
          />
          <input
            name="location"
            placeholder="Pickup Location"
            className="input"
            required
          />

          <button type="submit" className="btn">
            Add Task
          </button>
        </form>

        <h2>My Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-muted">No tasks assigned yet</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task, index) => (
              <li key={index} className="task-card">
                <strong>{task.foodItem}</strong> — from {task.donor} to {task.ngo}
                <br />
                Location: {task.location} | Status: {task.status}
                <br />
                Assigned At: {new Date(task.assignedAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default VolunteerDashboard;
