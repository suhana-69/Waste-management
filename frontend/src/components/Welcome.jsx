import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Welcome() {
  const history = useHistory();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        setTimeout(() => history.push("/login"), 1500);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        setLoading(false);

        // Auto-redirect after 3 seconds
        setTimeout(() => {
          switch (res.data.role) {
            case "donor":
              history.push("/donor-dashboard");
              break;
            case "ngo":
              history.push("/ngo-dashboard");
              break;
            case "volunteer":
              history.push("/volunteer-dashboard");
              break;
            default:
              history.push("/");
          }
        }, 3000);

      } catch (err) {
        console.error("Fetch profile error:", err.response || err.message);
        setError("Failed to fetch profile. Please login again.");
        setLoading(false);
        setTimeout(() => history.push("/login"), 2000);
      }
    };

    fetchProfile();
  }, [history]);

  const roleGreeting = (role) => {
    switch (role) {
      case "donor":
        return "Thank you for helping others!";
      case "ngo":
        return "Thank you for making a difference!";
      case "volunteer":
        return "Thank you for your valuable time!";
      default:
        return "Welcome!";
    }
  };

  if (loading) {
    return (
      <div className="welcome-container">
        <h2>Loading your profile...</h2>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="welcome-container">
        <h2 className="error">{error}</h2>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        {/* ✅ Keep previous style and animation, just fix name */}
        <h1>Welcome, {profile.name || profile.donorDetails?.name || "Donor"}!</h1>
        <h3 className="role-greeting">{roleGreeting(profile.role)}</h3>

        <div className="profile-info">
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>City:</strong> {profile.city}, {profile.state}</p>
        </div>

        <p className="redirect-msg">Redirecting to your dashboard...</p>
        <div className="spinner"></div>
      </div>

      <style>{`
        .welcome-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
        }

        .welcome-card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          max-width: 450px;
          width: 100%;
          text-align: center;
          animation: fadeIn 0.8s ease-in-out;
        }

        .welcome-card h1 {
          font-size: 28px;
          color: #333;
          margin-bottom: 10px;
        }

        .role-greeting {
          font-size: 18px;
          color: #4CAF50;
          margin-bottom: 20px;
        }

        .profile-info p {
          margin: 6px 0;
          color: #555;
          font-size: 15px;
        }

        .redirect-msg {
          margin-top: 20px;
          font-style: italic;
          color: #777;
        }

        .spinner {
          margin: 20px auto 0;
          border: 6px solid #f3f3f3;
          border-top: 6px solid #4CAF50;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .error {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
}

export default Welcome;
