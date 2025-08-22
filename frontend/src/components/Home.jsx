// frontend/src/components/Home.jsx
import React, { useState } from "react";
import axios from "axios";
import FoodList from "./FoodList";

function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await axios.post("http://localhost:5000/api/contact", formData);
      if (res.data.success) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("Failed to send message.");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero" id="home">
        <div className="hero-content">
          <h1>Turning Surplus Food into Smiles</h1>
          <p>Together we fight hunger and reduce food waste</p>
          {/* Removed Donate and Volunteer buttons */}
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="section" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-4 text-red-500">About FoodSavior</h2>
        <p className="text-center text-lg">
          FoodSavior is a cloud-based platform connecting donors, NGOs, and volunteers
          to ensure surplus food reaches underprivileged communities. We reduce food
          waste, ensure transparency, and bring hope through meals.
        </p>
      </section>

      {/* Dynamic Available Foods Section */}
      <section id="foods" className="section dark" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">
          Available Food Donations
        </h2>
        <FoodList />
      </section>

      {/* How It Works */}
      <section id="how" className="section" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">How It Works</h2>
        <div className="steps" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
          <div className="step" style={{ flex: "1", minWidth: "250px", backgroundColor: "#2d2d2d", color: "#fff", padding: "1rem", borderRadius: "0.5rem" }}>
            <h3 className="font-bold mb-2">1. Donate Food</h3>
            <p>Restaurants register surplus food.</p>
          </div>
          <div className="step" style={{ flex: "1", minWidth: "250px", backgroundColor: "#2d2d2d", color: "#fff", padding: "1rem", borderRadius: "0.5rem" }}>
            <h3 className="font-bold mb-2">2. Pickup</h3>
            <p>Volunteers collect and check hygiene.</p>
          </div>
          <div className="step" style={{ flex: "1", minWidth: "250px", backgroundColor: "#2d2d2d", color: "#fff", padding: "1rem", borderRadius: "0.5rem" }}>
            <h3 className="font-bold mb-2">3. Distribute</h3>
            <p>NGOs deliver meals to communities.</p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="section dark" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">Our Impact</h2>
        <div className="impact-grid" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: "1", minWidth: "200px", backgroundColor: "#f87171", color: "#fff", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
            <h3 className="font-bold text-xl">50K+</h3><p>Meals Served</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px", backgroundColor: "#f87171", color: "#fff", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
            <h3 className="font-bold text-xl">120+</h3><p>Volunteers</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px", backgroundColor: "#f87171", color: "#fff", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
            <h3 className="font-bold text-xl">30+</h3><p>NGOs Partnered</p>
          </div>
          <div style={{ flex: "1", minWidth: "200px", backgroundColor: "#f87171", color: "#fff", padding: "1rem", borderRadius: "0.5rem", textAlign: "center" }}>
            <h3 className="font-bold text-xl">15</h3><p>Cities Covered</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows={5} />
          <button type="submit" className="btn">Send Message</button>
          {status && <p className={`mt-2 text-center ${status.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{status}</p>}
        </form>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ textAlign: "center", padding: "1rem", backgroundColor: "#222", color: "#fff" }}>
        <p>© 2025 FoodSavior – All Rights Reserved</p>
      </footer>
    </>
  );
}

export default Home;
