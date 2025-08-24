import React from "react";

const Donation = () => {
  const handleDonation = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your index.html script.");
      return;
    }

    const options = {
      key: "rzp_test_YourTestKeyHere", // Replace with your Razorpay Test Key
      amount: 5000 * 100, // ₹5000 in paise
      currency: "INR",
      name: "FoodSavior NGO",
      description: "Support Our NGO",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#ff3b3f",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        marginTop: "3rem",
        textAlign: "center",
        padding: "2rem",
        borderRadius: "12px",
        backgroundColor: "#fff5f5",
        boxShadow: "0 8px 20px rgba(255, 59, 63, 0.2)",
        maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#ff3b3f",
          marginBottom: "1rem",
        }}
      >
        Support Our NGO
      </h2>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#333" }}>
        Help us fight hunger and reduce food waste by donating ₹5000
      </p>
      <button
        onClick={handleDonation}
        style={{
          background: "linear-gradient(90deg, #ff6b6b, #ff3b3f)",
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: "bold",
          padding: "0.8rem 2rem",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 6px 15px rgba(255, 59, 63, 0.4)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      >
        Donate ₹5000
      </button>
    </div>
  );
};

export default Donation;
