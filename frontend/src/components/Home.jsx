import React, { useState } from "react";
import axios from "axios";
import Donation from "./Donation";

// Example icons (replace with your own image paths from /assets or online URLs)
import donateIcon from "../images/donate.jpeg";
import pickupIcon from "../images/pick.jpeg";
import distributeIcon from "../images/s.png";

import mealsIcon from "../images/s.png";
import volunteerIcon from "../images/v.png";
import ngoIcon from "../images/c.png";
import cityIcon from "../images/res.png";

const Home = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  // 🔹 Dynamic Content (with optional images/icons)
  const aboutContent = [
    "CloudCrumbs is more than just a food donation platform – it’s a movement. Every year, millions of tons of food are wasted, while countless families go to bed hungry. Our mission is to close this gap by creating a digital bridge between those who have surplus food and those who desperately need it.",
    "We connect restaurants, NGOs, volunteers, and individuals on one platform to ensure that every extra meal finds a home. With real-time tracking, verified NGOs, and dedicated volunteers, we guarantee transparency, hygiene, and impact — making sure every donation truly brings a smile."
  ];

  const howItWorks = [
    {
      step: "1. Donate Food",
      desc: "Restaurants, events, and individuals with surplus food can quickly register their donation on our platform.",
      img: donateIcon,
    },
    {
      step: "2. Pickup & Quality Check",
      desc: "Volunteers collect the food and ensure it passes hygiene and quality standards before delivery.",
      img: pickupIcon,
    },
    {
      step: "3. Distribute with Love",
      desc: "Partner NGOs and kitchens distribute meals to orphanages, shelters, and families in need.",
      img: distributeIcon,
    },
  ];

  const impactStats = [
    { value: "50K+", label: "Meals Served", desc: "Nutritious meals delivered to children, families, and the homeless.", img: mealsIcon },
    { value: "120+", label: "Volunteers", desc: "Everyday heroes who dedicate their time to collect and distribute food.", img: volunteerIcon },
    { value: "30+", label: "NGOs Partnered", desc: "Trusted partners ensuring food reaches the right hands.", img: ngoIcon },
    { value: "15", label: "Cities Covered", desc: "Expanding across urban and rural regions to maximize our reach.", img: cityIcon },
  ];

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
     {/* Hero Section */}
<header
  className="hero"
  id="home"
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    backgroundColor: "#fef3f2",
    textAlign: "center",
  }}
>
  <h1 className="text-4xl font-bold mb-4">
    Turning Surplus Food into Smiles
  </h1>

  <div style={{ width: "100%", maxWidth: "500px" }}>
    <Donation />
  </div>
</header>


      {/* About Section */}
      <section id="about" className="section" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-4 text-red-500">About FoodSavior</h2>
        {aboutContent.map((text, idx) => (
          <p key={idx} className="text-center text-lg mb-6">{text}</p>
        ))}
      </section>

      {/* How It Works Section */}
      <section id="how" className="section" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">How It Works</h2>
        <div className="steps" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1.5rem" }}>
          {howItWorks.map((item, idx) => (
            <div
              key={idx}
              className="step"
              style={{
                flex: "1",
                minWidth: "280px",
                backgroundColor: "#2d2d2d",
                color: "#fff",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
             <img
  src={item.img}
  alt={item.step}
  style={{
    width: "120px",
    height: "auto",
    objectFit: "contain",
    margin: "0 auto 1rem",
    display: "block",
  }}
/>

              <h3 className="font-bold mb-2">{item.step}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="section dark" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <h2 className="text-3xl font-bold text-center mb-6 text-red-500">Our Impact</h2>
        <p className="text-center text-lg mb-8">
          Every number represents a story of hope. Behind each meal served, volunteer onboarded, or city expanded, there are lives touched and smiles created.
        </p>
        <div className="impact-grid" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "1.5rem" }}>
          {impactStats.map((item, idx) => (
            <div
              key={idx}
              style={{
                flex: "1",
                minWidth: "220px",
                backgroundColor: "#f87171",
                color: "#fff",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                textAlign: "center",
              }}
            >
              <img
  src={item.img}
  alt={item.label}
  style={{
    width: "100px",
    height: "auto",
    objectFit: "contain",
    margin: "0 auto 1rem",
    display: "block",
  }}
/>

              <h3 className="font-bold text-2xl">{item.value}</h3>
              <p className="font-semibold">{item.label}</p>
              <p className="text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
    {/* Contact Section */}
<section
  id="contact"
  className="section"
  style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}
>
  <h2 className="text-3xl font-bold text-center mb-6 text-red-500">
    Contact Us
  </h2>
  <form
    onSubmit={handleSubmit}
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <input
      type="text"
      name="name"
      placeholder="Your Name"
      value={formData.name}
      onChange={handleChange}
      required
      style={{
        padding: "0.75rem 1rem",
        fontSize: "16px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "100%",
      }}
    />

    <input
      type="email"
      name="email"
      placeholder="Your Email"
      value={formData.email}
      onChange={handleChange}
      required
      style={{
        padding: "0.75rem 1rem",
        fontSize: "16px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "100%",
      }}
    />

    <textarea
      name="message"
      placeholder="Your Message"
      value={formData.message}
      onChange={handleChange}
      required
      rows={5}
      style={{
        padding: "0.75rem 1rem",
        fontSize: "16px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        width: "100%",
        resize: "vertical",
      }}
    />

    <button
      type="submit"
      className="btn"
      style={{
        padding: "0.75rem 1.5rem",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#ff3b3f",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        transition: "background-color 0.3s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#e03335")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#ff3b3f")}
    >
      Send Message
    </button>

    {status && (
      <p
        className="mt-2 text-center"
        style={{
          color: status.includes("success") ? "green" : "red",
          fontWeight: "500",
        }}
      >
        {status}
      </p>
    )}
  </form>
</section>

      {/* Footer */}
      <footer className="footer" style={{ textAlign: "center", padding: "1rem", backgroundColor: "#222", color: "#fff" }}>
        <p>© 2025 CloudCrumbs – All Rights Reserved</p>
      </footer>
    </>
  );
};

export default Home;
