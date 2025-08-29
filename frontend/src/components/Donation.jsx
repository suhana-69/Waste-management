import React from "react";

const Donation = () => {
  const handleDonation = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your index.html script.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/payment/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const order = await res.json();

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_R9Fl4RhWIxLeKL",
      amount: order.amount,
      currency: order.currency,
      name: "CloudCrumbs NGO",
      description: "Support Our NGO",
      order_id: order.id,
      handler: function (response) {
        alert("Payment successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999",
      },
      theme: { color: "#ff3b3f" },
    };
console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 25px rgba(255, 59, 63, 0.2)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "bold",
            color: "#ff3b3f",
            marginBottom: "1rem",
          }}
        >
          Support Our NGO
        </h2>
        <p
          style={{
            fontSize: "1rem",
            marginBottom: "1.5rem",
            color: "#444",
            lineHeight: "1.5",
          }}
        >
          Help us reduce food waste and feed the hungry by donating ₹5000.
        </p>
        <button
          onClick={handleDonation}
          style={{
            background: "linear-gradient(90deg, #ff6b6b, #ff3b3f)",
            color: "#fff",
            fontSize: "1.1rem",
            fontWeight: "600",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          Donate ₹5000
        </button>
      </div>
    </div>
  );
};

export default Donation;
